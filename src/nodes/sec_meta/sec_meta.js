"use strict";

var _ = require("underscore");
var Document = require('../../../node_modules/lens/substance/document/index');
var Composite = Document.Composite;

// Lens.Box
// -----------------
//

var secMeta = function(node, doc) {
  Composite.call(this, node, doc);
};

// Type definition
// -----------------
//

secMeta.type = {
  "id": "sec_meta",
  "parent": "content",
  "properties": {
      "children":{
        "abstract":"abstract",

      },
      "authors": ["array", "paragraph"],
      "abstract":["array", "abstract"],
    }


};

// This is used for the auto-generated docs
// -----------------
//

secMeta.description = {
  "name": "Section",
  "remarks": [
    "Sectin Element for metadata",
  ],
  "properties": {
    "children": {
      "abstract": "abstract element"
    }
  }
};


// Example Section Metadata
// -----------------
//

secMeta.example = {
  "id": "sec_meta_1",
  "type": "sec_meta",

  "children": {
      "abstract":"abstract_id"}
};

secMeta.Prototype = function() {

  this.getChildrenIds = function() {
    return this.properties.children;
  };

  this.getAuthors = function() {
        return _.map(this.properties.authors, function(paragraphId) {
            return this.document.get(paragraphId);
        }, this);
    };

    this.getAbstract = function() {
        return _.map(this.properties.abstract, function(paragraphId) {
            return this.document.get(paragraphId);
        }, this);
    };

};

secMeta.Prototype.prototype = Composite.prototype;
secMeta.prototype = new secMeta.Prototype();
secMeta.prototype.constructor = secMeta;

Document.Node.defineProperties(secMeta);

module.exports = secMeta;
