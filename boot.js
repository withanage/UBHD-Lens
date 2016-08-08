window.Lens = require("./src/ubhd-lens");

// Little helper used to parse query strings from urls
// --------
//

var qs = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
      // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
} ();


var url = window.location.href;
var url_sp = url.split('/');
var protocol = url_sp[0];
var server= url_sp[2];


var documentURL = protocol+'//'+server+'/'+application+'/static/files/presses/'+press_id+'/monographs/'+submission_id+'/submission/proof/'+submission_file;
$(function() {
    var app = new window.Lens({
        document_url: qs.url ? decodeURIComponent(qs.url) : documentURL
    });
    app.start();
    window.app = app;
});