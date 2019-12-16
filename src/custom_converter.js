"use strict";

var LensConverter = require('lens/converter');

var LensArticle = require("lens/article");
var CustomNodeTypes = require("./nodes");

var CustomConverter = function(options) {
  LensConverter.call(this, options);
};

CustomConverter.Prototype = function() {

   this.test  = function (xmlDoc) {
      // check  NLM jats elements
      var article = xmlDoc.querySelector("article");
      if (article !=null) {
          return true;
      }
      return false;

    }

  // Override document factory so we can create a customized Lens article,
  // including overridden node types
  this.createDocument = function() {
    var doc = new LensArticle({
      nodeTypes: CustomNodeTypes
    });

    return doc;
  };

  // Resolve figure urls
  // --------
  //


    this.enhanceFigure = function (state, node, element) {
        var graphic = element.querySelector("graphic");
        var url = graphic !== null ? graphic.getAttribute("xlink:href") : "";
        node.url = this.resolveURL(state, url);
    };


    // Example url to JPG: http://cdn.elifesciences.org/elife-articles/00768/svg/elife00768f001.jpg
    this.resolveURL = function (state, url) {
        var s = window.location.pathname;

        var parts = s.split("/");
        var length =parts.length;

        parts[length-3] = "media?";
        parts[length-2] =   "/submissionId="+parts[length-2];
        parts[length-1] =   "/&fileId="+parts[length-1];
        parts.push("/&fileName="+url);

        var path = parts.join('/');

        var customURL= path.replace(/\/\//g,'');

        // Use absolute URL
        if (url.match(/http[s]:\/\//)) return url;

        // Look up base url
        var baseURL = this.getBaseURL(state);



        if (baseURL) {
            return [baseURL, url].join('');
        } else {
           return customURL;

        }
    };

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
};
this.caption = function (state, caption) {
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

CustomConverter.Prototype.prototype = LensConverter.prototype;
CustomConverter.prototype = new CustomConverter.Prototype();
CustomConverter.prototype.constructor = CustomConverter;

module.exports = CustomConverter;
