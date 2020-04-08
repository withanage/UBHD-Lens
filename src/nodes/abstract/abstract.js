"use strict";

var Document = require('../../../node_modules/lens/substance/document/index');
var Composite = Document.Composite;

// Lens.Box
// -----------------
//

var Abstract = function(node, doc) {
    Composite.call(this, node, doc);
};

// Type definition
// -----------------
//

Abstract.type = {
    "id": "abstract",
    "parent": "content",
    "properties": {
        "title":"text",
        "children": ["array", "paragraph"]
    }


};

// This is used for the auto-generated docs
// -----------------
//

Abstract.description = {
    "name": "Abstract",
    "remarks": [
        "Abstract",
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

Abstract.example = {
    "id": "abstract_1",
    "type": "abstract",

    "children": {
        "abstract":"abstract_id"}
};

Abstract.Prototype = function() {

    this.getChildrenIds = function() {
        return this.properties.children;
    };

};

Abstract.Prototype.prototype = Composite.prototype;
Abstract.prototype = new Abstract.Prototype();
Abstract.prototype.constructor = Abstract;

Document.Node.defineProperties(Abstract);

module.exports = Abstract;
