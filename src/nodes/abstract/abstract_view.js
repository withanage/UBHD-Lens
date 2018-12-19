"use strict";

var NodeView = require('../../../node_modules/lens/article/nodes/node/index').View;
var CompositeView = require("../../../node_modules/lens/article/nodes/composite/index").View;
var $$ = require("../../../node_modules/lens/substance/application/index").$$;

// Lens.abstract.View
// ==========================================================================

var abstractView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

abstractView.Prototype = function () {

    this.render = function () {
        NodeView.prototype.render.call(this);
        this.content = document.createElement("div");

        var title = this.node.title;

        if (title != null || title !== undefined) {
            if (title.textContent === undefined & title.length == 0) {
                title = document.createElement("div");
                title.className = 'content';
                var title_text = document.createElement("div");
                title_text.className = 'content-node text';
                title.appendChild(title_text);
                this.content.appendChild(title);

            }
            else {
                if (title.length > 0) {
                    var childView = this.createChildView(title);
                    var childViewEl = childView.render().el;
                    childViewEl.className += ' title';
                    this.content.appendChild(childViewEl);
                }

            }
        }

        if (this.node.children.length > 0) {
            this.el.appendChild(this.content);
            this.renderChildren();
        }
        return this;
    };
};

abstractView.Prototype.prototype = CompositeView.prototype;
abstractView.prototype = new abstractView.Prototype();

module.exports = abstractView;

