"use strict";

var LensConverter = require('lens/converter');

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

  this.sanitizeXML = function (xmlDoc) {
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
        var child = figure.children[j];
        if (child.tagName === "caption") {
          hasCaption = true;
        }
      }
      if (hasCaption===false) {
        var caption = document.createElement("caption");
        var element = document.createElement("p");
        var content = document.createTextNode(".");
        element.appendChild(content);
        element.style.visibility = "hidden";
        caption.appendChild(element);
        figure.appendChild(caption);

      }
    }

    return xmlDoc;
  };


  // Resolve figure urls
  // --------
  //
  /*

    this.enhanceFigure = function(state, node, element) {
      var graphic = element.querySelector("graphic");
      var url = graphic.getAttribute("xlink:href");
      node.url = this.resolveURL(state, url);
    };

  */

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

  // Override tableWrap to handle thead and tbody properly
  this.tableWrap = function(state, tableWrap) {
    var doc = state.doc;
    var label = tableWrap.querySelector("label");
    var table = tableWrap.querySelector("table");

    var content = {};
    var rowIndex = 0;

    // Process thead rows first
    var thead = table.querySelector("thead");
    if (thead) {
      var theadRows = thead.querySelectorAll("tr");
      for (var i = 0; i < theadRows.length; i++) {
        var row = this.processTableRow(state, theadRows[i], true);
        content[rowIndex] = row;
        rowIndex++;
      }
    }

    // Process tbody rows
    var tbody = table.querySelector("tbody");
    var bodyRows = tbody ? tbody.querySelectorAll("tr") : table.querySelectorAll("tr");
    for (var i = 0; i < bodyRows.length; i++) {
      // Skip rows that are already processed in thead
      if (thead && bodyRows[i].parentNode === thead) continue;
      var row = this.processTableRow(state, bodyRows[i], false);
      content[rowIndex] = row;
      rowIndex++;
    }

    var tableNode = {
      "id": state.nextId("table"),
      "source_id": tableWrap.getAttribute("id"),
      "type": "table",
      "title": "",
      "label": label ? label.textContent : "",
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
    var cells = tr.children; // Get all td or th elements

    for (var j = 0; j < cells.length; j++) {
      var tds = {};
      var cell = cells[j];

      // Check if cell has p elements
      var hasParagraphs = false;
      for (var m = 0; m < cell.childNodes.length; m++) {
        if (cell.childNodes[m].nodeName === 'p') {
          hasParagraphs = true;
          break;
        }
      }

      if (hasParagraphs) {
        // Process p elements directly
        var pElements = cell.querySelectorAll('p');
        for (var k = 0; k < pElements.length; k++) {
          tds[k] = {};
          tds[k].nodes = this.paragraphGroup(state, pElements[k]);
          tds[k].attributes = cell.attributes;
          tds[k].isHeader = isHeader;
        }
      } else {
        // Wrap all cell content in a paragraph for processing
        var p = document.createElement('p');

        // Clone all child nodes into the paragraph
        for (var k = 0; k < cell.childNodes.length; k++) {
          var clonedNode = cell.childNodes[k].cloneNode(true);
          p.appendChild(clonedNode);
        }

        // Only process if there's content
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
};


CustomConverter.Prototype.prototype = LensConverter.prototype;
CustomConverter.prototype = new CustomConverter.Prototype();
CustomConverter.prototype.constructor = CustomConverter;

module.exports = CustomConverter;
