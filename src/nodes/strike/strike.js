
var Annotation = require('../../../node_modules/lens/article/nodes/annotation/annotation');

var Strike = function(node, doc) {
  Annotation.call(this, node, doc);
};

Strike.type = {
  id: "strike",
  parent: "annotation",
  properties: {}
};

Strike.Prototype = function() {};
Strike.Prototype.prototype = Annotation.prototype;
Strike.prototype = new Strike.Prototype();
Strike.prototype.constructor = Strike;

Strike.fragmentation = Annotation.DONT_CARE;

module.exports = Strike;
