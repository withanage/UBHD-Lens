"use strict";

var NodeView = require('../../../node_modules/lens/article/nodes/node/index').View;
var CompositeView = require("../../../node_modules/lens/article/nodes/composite/index").View;

var $$ = require("../../../node_modules/lens/substance/application/index").$$;


var HTMLTableView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

HTMLTableView.Prototype = function () {

    this.render = function () {



        NodeView.prototype.render.call(this);
        var childView, childViewEl, htmlTable, row,  cell;
        htmlTable = document.createElement('table');
        var attrs = this.node.properties.table_attributes;
        if (attrs.length > 0) {
            for (var k=0; k < attrs.length; k++) {
                htmlTable.setAttribute(attrs[k].nodeName, attrs[k].nodeValue);
            }
        }

        if (attrs.getNamedItem('specific-use')===null) {
            htmlTable.setAttribute('class', 'gitter-tabelle');
        }
        else {
            htmlTable.setAttribute('class', attrs.getNamedItem('specific-use').nodeValue);
        }

        var tr, i, j, k;
        var rows = this.node.getChildrenIds();
        var thead = null;
        var tbody = null;

        if (rows !== undefined) {
            for (var r in rows) {
                row = rows[r];
                tr = document.createElement('tr');
                var isHeaderRow = false;

                for (i in row) {
                    var cellData = row[i];
                    // Check if this is a header cell
                    var isHeader = false;
                    for (j in cellData) {
                        if (cellData[j].isHeader) {
                            isHeader = true;
                            isHeaderRow = true;
                            break;
                        }
                    }

                    // Create th or td based on header flag
                    cell = document.createElement(isHeader ? 'th' : 'td');

                    for (j in cellData) {
                        var cell_nodes = cellData[j].nodes;
                        var attr = cellData[j].attributes;
                        if (cell_nodes !== undefined) {
                            for (k = 0; k < cell_nodes.length; k++) {
                                childView = this.createChildView(cell_nodes[k].id);
                                childViewEl = childView.render().el;
                                cell.appendChild(childViewEl);

                            }
                            for (var m=0; m < attr.length; m++) {
                                cell.setAttribute(attr[m].nodeName, attr[m].nodeValue);

                            }
                        }


                    }
                    // Convert image links to inline images
                    this._convertImageLinks(cell);

                    tr.appendChild(cell);
                }

                // Add row to thead or tbody
                if (isHeaderRow) {
                    if (!thead) {
                        thead = document.createElement('thead');
                        htmlTable.appendChild(thead);
                    }
                    thead.appendChild(tr);
                } else {
                    if (!tbody) {
                        tbody = document.createElement('tbody');
                        htmlTable.appendChild(tbody);
                    }
                    tbody.appendChild(tr);
                }
            }
        }

        // Display caption
        var labelView = this.createTextPropertyView([this.node.id, 'label'], {
            classes: 'enum-label'
        });
        this.content.appendChild(labelView.render().el);

        if (this.node.caption) {
            var captionView = this.createView(this.node.caption);
            this.content.appendChild(captionView.render().el);
        }

        this.content.appendChild(htmlTable);

        this.el.appendChild(this.content);




        return this;
    };

    // Convert links pointing to images into inline <img> tags
    this._convertImageLinks = function(cell) {
        var links = cell.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href') || '';
            if (href.match(/\.(png|jpg|jpeg|gif|svg|webp)(\?|$)/i)) {
                var img = document.createElement('img');
                img.src = href;
                img.style.maxWidth = '200px';
                img.style.maxHeight = '150px';
                img.style.display = 'block';
                var a = document.createElement('a');
                a.href = href;
                a.target = '_blank';
                a.appendChild(img);
                links[i].parentNode.replaceChild(a, links[i]);
            }
        }
    };
};

HTMLTableView.Prototype.prototype = CompositeView.prototype;
HTMLTableView.prototype = new HTMLTableView.Prototype();

module.exports = HTMLTableView;


