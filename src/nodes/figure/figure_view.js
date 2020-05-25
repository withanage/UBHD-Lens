"use strict";

var _ = require('underscore');
var CompositeView = require("../../../node_modules/lens/article/nodes/composite/index").View;
var $$ = require("../../../node_modules/lens/substance/application/index").$$;
var ResourceView = require('../../../node_modules/lens/article/resource_view');

// Substance.Figure.View
// ==========================================================================

var FigureView = function(node, viewFactory, options) {
  CompositeView.call(this, node, viewFactory);


  // Mix-in
  ResourceView.call(this, options);
};

FigureView.Prototype = function() {

  // Mix-in
  _.extend(this, ResourceView.prototype);

  this.isZoomable = true;

  // Rendering
  // =============================
  //

  this.renderBody = function() {
    this.content.appendChild($$('.label', {text: this.node.label}));

    var nodeUrl = this.node.url;




    if (nodeUrl) {
      // Add graphic (img element)
      var imgEl = $$('.image-wrapper', {
        children: [
          $$("a", {
            href: nodeUrl,
            target: "_blank",
            class: "toggle toggle-fullscreen",
            children: [$$("img", {src: nodeUrl})]
          })
        ]
      });
      this.content.appendChild(imgEl);
    }
    this.renderChildren();
    // Attrib
    if (this.node.attrib) {
      this.content.appendChild($$('.figure-attribution', {text: this.node.attrib}));
    }
  };

  this.renderLabel = function() {
    var labelEl = $$('.name', {
      href: "#"
    });

    this.renderAnnotatedText([this.node.id, 'label'], labelEl);
    return labelEl;
  };

};

FigureView.Prototype.prototype = CompositeView.prototype;
FigureView.prototype = new FigureView.Prototype();

module.exports = FigureView;
