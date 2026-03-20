"use strict";

var LensConverter = require('lens/converter');
var _ = require("underscore");
var util = require("lens/substance/util");

var LensArticle = require("lens/article");
var CustomNodeTypes = require("./nodes");

var CustomConverter = function (options) {
  LensConverter.call(this, options);
};

CustomConverter.Prototype = function () {

  this.test = function (xmlDoc) {
    // check  NLM jats elements
    var article = xmlDoc.querySelector("article");
    if (article != null) {
      return true;
    }
    return false;

  }

  // Override document factory so we can create a customized Lens article,
  // including overridden node types
  this.createDocument = function () {
    var doc = new LensArticle({
      nodeTypes: CustomNodeTypes
    });

    return doc;
  };

  this.captionNew = function (state, caption) {
    var doc = state.doc;
    var captionNode = {
      "id": state.nextId("caption"),
      "source_id": caption.getAttribute("id"),
      "type": "caption",
      "title": "",
      "children": []
    };
    // Titles can be annotated, thus delegate to paragraph
    var title = caption.querySelector("title");
    if (title) {
      // Resolve title by delegating to the paragraph
      var node = this.paragraph(state, title);
      if (node) {
        captionNode.title = node.id;
      }
    }
    var children = [];
    var paragraphs = caption.querySelectorAll("p");
    _.each(paragraphs, function (p) {
      // Only consider direct children
      if (p.parentNode !== caption) return;
      var node = this.paragraph(state, p);
      if (node) children.push(node.id);
    }, this);
    captionNode.children = children;
    doc.create(captionNode);
    return captionNode;
  };

  // Resolve figure urls
  // --------
  //
  this.enhanceFigure = function(state, node, element) {
    var graphic = element.querySelector("graphic");
    if (graphic) {
      var url = graphic.getAttribute("xlink:href");
      if (url) {
        node.url = this.resolveURL(state, url);
      }
    }
  };

  // Example url to JPG: http://cdn.elifesciences.org/elife-articles/00768/svg/elife00768f001.jpg
  /*
    this.resolveURL = function(state, url) {
      console.log(url);
    // Use absolute URL
    if (url.match(/http[s]:\/\//)) return url;

    // Look up base url
    var baseURL = this.getBaseURL(state);

    if (baseURL) {
      return [baseURL, url].join('');
    } else {
        // Use special URL resolving for production articles
        return [
            "http://cdn.elifesciences.org/elife-articles/",
            state.doc.id,
            "/jpg/",
            url,
            ".jpg"
        ].join('');
    }
  };
  */

  /**
   this.enhanceVideo = function(state, node, element) {
    var href = element.getAttribute("xlink:href").split(".");
    var name = href[0];
    node.url = "http://api.elifesciences.org/v2/articles/"+state.doc.id+"/media/file/"+name+".mp4";
    node.url_ogv = "http://api.elifesciences.org/v2/articles/"+state.doc.id+"/media/file//"+name+".ogv";
    node.url_webm = "http://api.elifesciences.org/v2/articles/"+state.doc.id+"/media/file//"+name+".webm";
    node.poster = "http://api.elifesciences.org/v2/articles/"+state.doc.id+"/media/file/"+name+".jpg";
  };
   **/

  // Override enhancePublicationInfo to extract subjects from article-categories
  this.enhancePublicationInfo = function(state, pubInfoNode) {
    var doc = state.doc;
    var article = state.xmlDoc.querySelector("article");

    // Extract subjects from article-categories
    var articleCategories = article.querySelector("article-categories");
    if (articleCategories) {
      var subjectGroups = articleCategories.querySelectorAll("subj-group");
      var subjects = [];

      for (var i = 0; i < subjectGroups.length; i++) {
        var subjectElements = subjectGroups[i].querySelectorAll("subject");
        for (var j = 0; j < subjectElements.length; j++) {
          var subjectText = subjectElements[j].textContent.trim();
          if (subjectText && subjects.indexOf(subjectText) === -1) {
            subjects.push(subjectText);
          }
        }
      }

      if (subjects.length > 0) {
        pubInfoNode.subjects = subjects;
      }
    }

    // Update the document node
    doc.set(['publication_info', 'subjects'], pubInfoNode.subjects);
  };

  // Handle fig-group elements by processing the individual figures inside them
  this.figureGroup = function(state, figGroup) {
    var figures = figGroup.querySelectorAll("fig");
    var nodes = [];
    for (var i = 0; i < figures.length; i++) {
      var figNode = this.figure(state, figures[i]);
      if (figNode) {
        nodes.push(figNode);
      }
    }
    return nodes;
  };

  // Override paragraph element handling to support inline figures
  // Remove fig and fig-group from ignored elements
  this.ignoredParagraphElements = {
    "comment": true,
    "supplementary-material": true,
    "media": true,
  };

  // Add fig and fig-group to accepted paragraph elements so they appear inline
  this.acceptedParagraphElements = {
    "boxed-text": {handler: "boxedText"},
    "disp-quote": {handler: "quoteText"},
    "list": {handler: "list"},
    "disp-formula": {handler: "formula"},
    "speech": {handler: "speechText"},
    "table-wrap": {handler: "tableWrap"},
    "fig": {handler: "figure"},
    "fig-group": {handler: "figureGroup"}
  };

  // Fix #1/#2: Override contributor to handle <string-name> and <contrib-id> ORCID
  this.contributor = function(state, contrib) {
    var doc = state.doc;

    var id = state.nextId("contributor");
    var contribNode = {
      id: id,
      source_id: contrib.getAttribute("id"),
      type: "contributor",
      name: "",
      affiliations: [],
      fundings: [],
      bio: [],
      image: "",
      deceased: false,
      emails: [],
      contribution: "",
      members: []
    };

    var contribType = contrib.getAttribute("contrib-type");
    contribNode["contributor_type"] = this._contribTypeMapping[contribType];

    var role = contrib.querySelector("role");
    if (role) {
      contribNode["role"] = role.textContent;
    }

    var bio = contrib.querySelector("bio");
    if (bio) {
      _.each(util.dom.getChildren(bio), function(par) {
        var graphic = par.querySelector("graphic");
        if (graphic) {
          contribNode.image = graphic.getAttribute("xlink:href");
        } else {
          var pars = this.paragraphGroup(state, par);
          if (pars.length > 0) {
            contribNode.bio = [ pars[0].id ];
          }
        }
      }, this);
    }

    if (contrib.getAttribute("deceased") === "yes") {
      contribNode.deceased = true;
    }

    // ORCID: support both <uri content-type="orcid"> and <contrib-id contrib-id-type="orcid">
    var orcidURI = contrib.querySelector("uri[content-type=orcid]");
    if (orcidURI) {
      contribNode.orcid = orcidURI.getAttribute("xlink:href");
    }
    if (!contribNode.orcid) {
      var contribIdOrcid = contrib.querySelector("contrib-id[contrib-id-type=orcid]");
      if (contribIdOrcid) {
        var orcidVal = contribIdOrcid.textContent.trim();
        contribNode.orcid = orcidVal.match(/^https?:\/\//) ? orcidVal : "https://orcid.org/" + orcidVal;
      }
    }

    // Name: support <name>, <collab>, and <string-name>
    var nameEl = contrib.querySelector("name");
    if (nameEl) {
      contribNode.name = this.getName(nameEl);
    } else {
      var stringName = contrib.querySelector("string-name");
      if (stringName) {
        contribNode.name = stringName.textContent.trim();
      } else {
        var collab = contrib.querySelector("collab");
        if (collab) {
          contribNode.name = collab.textContent;
        } else {
          contribNode.name = "N/A";
        }
      }
    }

    this.extractContributorProperties(state, contrib, contribNode);

    if (contribNode.affiliations.length === 0) {
      contribNode.affiliations = state.affiliations;
    }

    if (contribNode.competing_interests.length > 1) {
      contribNode.competing_interests = _.filter(contribNode.competing_interests, function(confl) {
        return confl.indexOf("no competing") < 0;
      });
    }

    var validTypes = ["author", "editor", "translator", "section-editor", "section-author", "chapter-author"];
    if (validTypes.indexOf(contribType) >= 0) {
      doc.nodes.document.authors.push(id);
    }

    doc.create(contribNode);
    doc.show("info", contribNode.id);
    return contribNode;
  };

  // Fix #3/#7: Override list to handle list-items with raw text and "order" list type
  this.list = function(state, list) {
    var doc = state.doc;

    var listNode = {
      "id": state.nextId("list"),
      "source_id": list.getAttribute("id"),
      "type": "list",
      "items": [],
      "item_ids": [],
      "ordered": false,
      "list_type": ""
    };

    var ltype = list.getAttribute("list-type");
    var o_types = ["alpha-lower", "alpha-upper", "ordered", "order", "roman-lower", "roman-upper"];
    for (var i = 0; i < o_types.length; i++) {
      if (ltype === o_types[i]) {
        listNode.ordered = true;
      }
    }
    listNode.list_type = ltype;

    var listItems = list.querySelectorAll("list-item");
    for (var i = 0; i < listItems.length; i++) {
      var listItem = listItems[i];
      if (listItem.parentNode !== list) continue;

      var children = util.dom.getChildren(listItem);
      var hasParagraphs = false;
      for (var c = 0; c < children.length; c++) {
        var ctype = util.dom.getNodeType(children[c]);
        if (ctype === "p" || ctype === "list" || ctype === "sec") {
          hasParagraphs = true;
          break;
        }
      }

      var nodes;
      if (hasParagraphs) {
        nodes = this.bodyNodes(state, children);
      } else {
        // Wrap raw text content in a <p> element for processing
        var p = document.createElement("p");
        for (var k = 0; k < listItem.childNodes.length; k++) {
          p.appendChild(listItem.childNodes[k].cloneNode(true));
        }
        nodes = this.paragraphGroup(state, p);
      }

      for (var j = 0; j < nodes.length; j++) {
        listNode.items.push(nodes[j].id);
        listNode.item_ids.push(i);
      }
    }

    doc.create(listNode);
    return listNode;
  };

  // Fix #9: Generate table label from id if no <label> element exists
  this.tableWrap = function(state, tableWrap) {
    var doc = state.doc;
    var label = tableWrap.querySelector("label");
    var table = tableWrap.querySelector("table");

    var content = {};
    var rowIndex = 0;

    var thead = table.querySelector("thead");
    if (thead) {
      var theadRows = thead.querySelectorAll("tr");
      for (var i = 0; i < theadRows.length; i++) {
        var row = this.processTableRow(state, theadRows[i], true);
        content[rowIndex] = row;
        rowIndex++;
      }
    }

    var tbody = table.querySelector("tbody");
    var bodyRows = tbody ? tbody.querySelectorAll("tr") : table.querySelectorAll("tr");
    for (var i = 0; i < bodyRows.length; i++) {
      if (thead && bodyRows[i].parentNode === thead) continue;
      var row = this.processTableRow(state, bodyRows[i], false);
      content[rowIndex] = row;
      rowIndex++;
    }

    // Generate label from source id if no <label> element (e.g. "table-1" -> "Table 1")
    var labelText = "";
    if (label) {
      labelText = label.textContent;
    } else {
      var sourceId = tableWrap.getAttribute("id");
      if (sourceId) {
        labelText = sourceId.replace(/^table-?/i, "Table ");
      }
    }

    var tableNode = {
      "id": state.nextId("table"),
      "source_id": tableWrap.getAttribute("id"),
      "type": "table",
      "title": "",
      "label": labelText,
      "children": content,
      "table_attributes": table.attributes,
      "caption": null,
      footers: [],
    };

    this.extractTableCaption(state, tableNode, tableWrap);
    doc.create(tableNode);
    return tableNode;
  };

  // Helper method to process a single table row
  this.processTableRow = function(state, tr, isHeader) {
    var trs = {};
    var cells = tr.children;

    for (var j = 0; j < cells.length; j++) {
      var tds = {};
      var cell = cells[j];

      var hasParagraphs = false;
      for (var m = 0; m < cell.childNodes.length; m++) {
        if (cell.childNodes[m].nodeName === 'p') {
          hasParagraphs = true;
          break;
        }
      }

      if (hasParagraphs) {
        var pElements = cell.querySelectorAll('p');
        for (var k = 0; k < pElements.length; k++) {
          tds[k] = {};
          tds[k].nodes = this.paragraphGroup(state, pElements[k]);
          tds[k].attributes = cell.attributes;
          tds[k].isHeader = isHeader;
        }
      } else {
        var p = document.createElement('p');
        for (var k = 0; k < cell.childNodes.length; k++) {
          p.appendChild(cell.childNodes[k].cloneNode(true));
        }
        if (p.childNodes.length > 0) {
          tds[0] = {};
          tds[0].nodes = this.paragraphGroup(state, p);
          tds[0].attributes = cell.attributes;
          tds[0].isHeader = isHeader;
        }
      }

      trs[j] = tds;
    }

    return trs;
  };

  // Fix #4: Pre-process XML to unescape &lt;sup&gt; in table cells
  this.sanitizeXML = function(xmlDoc) {
    // Original sanitization: fix empty captions
    var paragraphs = xmlDoc.querySelectorAll("p");
    for (var i = 0; i < paragraphs.length; i++) {
      var paragraph = paragraphs[i];
      var parentNode = paragraph.parentNode;
      if (paragraph !== undefined && paragraph.innerHTML === "" && parentNode.tagName == "caption")
        paragraph.innerHTML = ".";
    }

    var figures = xmlDoc.querySelectorAll("fig");
    for (var i = 0; i < figures.length; i++) {
      var figure = figures[i];
      var hasCaption = false;
      for (var j = 0; j < figure.children.length; j++) {
        if (figure.children[j].tagName === "caption") {
          hasCaption = true;
        }
      }
      if (hasCaption === false) {
        var caption = document.createElement("caption");
        var element = document.createElement("p");
        var content = document.createTextNode(".");
        element.appendChild(content);
        element.style.visibility = "hidden";
        caption.appendChild(element);
        figure.appendChild(caption);
      }
    }

    // Fix escaped HTML tags in table cells and list items
    var cells = xmlDoc.querySelectorAll("td, th, list-item");
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var html = cell.innerHTML;
      if (html.indexOf("&lt;sup&gt;") !== -1 || html.indexOf("&lt;sub&gt;") !== -1) {
        html = html.replace(/&lt;sup&gt;/g, "<sup>").replace(/&lt;\/sup&gt;/g, "</sup>");
        html = html.replace(/&lt;sub&gt;/g, "<sub>").replace(/&lt;\/sub&gt;/g, "</sub>");
        cell.innerHTML = html;
      }
    }

    return xmlDoc;
  };

  // Fix #10: Override extractCopyrightAndLicense to handle <copyright-year>/<copyright-holder>
  this.extractCopyrightAndLicense = function(state, article) {
    var dominated = state.doc;
    var doc = state.doc;
    var nodes = [];

    var license = article.querySelector("permissions");
    if (license) {
      var h1 = {
        "type": "heading",
        "id": state.nextId("heading"),
        "level": 3,
        "content": "Copyright & License"
      };
      doc.create(h1);
      nodes.push(h1.id);

      // Try <copyright-statement> first
      var copyright = license.querySelector("copyright-statement");
      if (copyright) {
        var par = this.paragraphGroup(state, copyright);
        if (par && par.length) {
          nodes = nodes.concat(_.map(par, function(p) { return p.id; }));
        }
      } else {
        // Fallback: construct from <copyright-year> and <copyright-holder>
        var year = license.querySelector("copyright-year");
        var holder = license.querySelector("copyright-holder");
        if (year || holder) {
          var parts = [];
          if (year) parts.push(year.textContent.trim());
          if (holder) parts.push(holder.textContent.trim());
          var copyrightText = parts.join(" ");
          var textNode = {
            id: state.nextId("text"),
            type: "text",
            content: copyrightText
          };
          doc.create(textNode);
          var paraNode = {
            id: state.nextId("paragraph"),
            type: "paragraph",
            children: [textNode.id]
          };
          doc.create(paraNode);
          nodes.push(paraNode.id);
        }
      }

      var lic = license.querySelectorAll("license");
      for (var i = 0; i < lic.length; i++) {
        if (lic[i].length == 1 || lic[i].getAttribute("xml:lang") == "en" || lic.length === 1) {
          for (var child = lic[i].firstElementChild; child; child = child.nextElementSibling) {
            var type = util.dom.getNodeType(child);
            if (type === 'p' || type === 'license-p') {
              var par = this.paragraphGroup(state, child);
              if (par && par.length) {
                nodes = nodes.concat(_.pluck(par, 'id'));
              }
            }
          }
        }
      }
    }

    return nodes;
  };

  // Override resolveURL to handle both HTTP and HTTPS URLs
  this.resolveURL = function(state, url) {
    if (!url) return "";
    // Return absolute URLs (both http and https)
    if (url.match(/^https?:\/\//)) return url;
    // For relative URLs, prepend the baseURL
    return [
      state.options.baseURL || "",
      url
    ].join('');
  };

  // Override viewMapping to show figures inline in content instead of figures panel
  this.viewMapping = {
    "box": "content",
    "supplement": "figures",
    "figure": "content",  // Changed from "figures" to "content" for inline display
    "video": "figures"
  };
};


CustomConverter.Prototype.prototype = LensConverter.prototype;
CustomConverter.prototype = new CustomConverter.Prototype();
CustomConverter.prototype.constructor = CustomConverter;

// Add fig-group handler to support figures inside fig-group elements
CustomConverter.prototype._bodyNodes["fig-group"] = function(state, child) {
  return this.figureGroup(state, child);
};

module.exports = CustomConverter;
