"use strict";

var Document = require('../../../node_modules/lens/substance/document/index');
var Composite = Document.Composite;

// Lens.Speech
// -----------------
//

var Speech = function(node, doc) {
  Composite.call(this, node, doc);
};

// Type definition
// -----------------
//

Speech.type = {
  "id": "speech",
  "parent": "content",
  "properties": {
    "source_id": "string",
    "label": "string",
    "children": ["array", "paragraph"],
    "speaker":["content"]

  }
};

// This is used for the auto-generated docs
// -----------------
//

Speech.description = {
  "name": "Speech",
  "remarks": [
    "A speech type.",
  ],
  "properties": {
    "label": "string",
    "children": "0..n Paragraph nodes",
  }
};


// Example Speech
// -----------------
//

Speech.example = {
  "id": "speech_1",
  "type": "speech",
  "label": "Speech 1",
  "children": ["paragraph_1", "paragraph_2"]
};

Speech.Prototype = function() {
  this.getChildrenIds = function() {
    return this.properties.children;
  };

};

Speech.Prototype.prototype = Composite.prototype;
Speech.prototype = new Speech.Prototype();
Speech.prototype.constructor = Speech;

Document.Node.defineProperties(Speech);

module.exports = Speech;
