"use strict";

var NodeView = require('../../../node_modules/lens/article/nodes/node/index').View;
var CompositeView = require("../../../node_modules/lens/article/nodes/composite/index").View;

var $$ = require("../../../node_modules/lens/substance/application/index").$$;


var SpeechView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

SpeechView.Prototype = function () {

    this.render = function () {
        NodeView.prototype.render.call(this);
        var i, htmlTable, tr, td, speaker;

        htmlTable = document.createElement('table');
        htmlTable.setAttribute('class', 'speeches');

        tr = document.createElement('tr');

        var speakers = this.node.speaker;
        for (i = 0; i < speakers.length; i++) {
            td = document.createElement('td');
            td.setAttribute('class', 'speaker');
            td.innerText = speakers[i].textContent;
        }

        tr.appendChild(td)
        var text = this.node.getChildrenIds();
        for (var i = 0; i < text.length; i++) {
            var td = document.createElement('td');
            td.setAttribute('class', 'speech');
            var childView = this.createChildView(text[i]);
            var childViewEl = childView.render().el;
            td.appendChild(childViewEl);
            tr.appendChild(td);

        }

        htmlTable.appendChild(tr);
        this.content.appendChild(htmlTable);

        this.el.appendChild(this.content);
        return this;
    };
};

SpeechView.Prototype.prototype = CompositeView.prototype;
SpeechView.prototype = new SpeechView.Prototype();

module.exports = SpeechView;
