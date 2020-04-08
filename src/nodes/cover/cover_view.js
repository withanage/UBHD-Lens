var LensNodes = require("lens/article/nodes");
var CoverView = LensNodes["cover"].View;
var $$ = require("lens/substance/application").$$;

var CustomCoverView = function (node, viewFactory) {
    CoverView.call(this, node, viewFactory);
};
CustomCoverView.Prototype = function () {
    this.render = function () {
        CoverView.prototype.render.call(this);

        var refUrl = encodeURIComponent(window.location.href);
        var ieWarning = $$('.intro.container', {
            children: [
                $$('.intro-text', {
                    html: '<i class="fa fa-exclamation"></i>&nbsp; &nbsp;<b>Internet Explorer is  only partially supported.</b>'
                }),

            ]
        });

        var resoultionWarning = $$('.intro.container', {
            children: [
                $$('.intro-text', {
                    html: '<i class="fa fa-exclamation"></i> <b>&nbsp; &nbsp; Minimum screen width of 1024px recommended for best user experience</b>'
                }),

            ]
        });
        var ua = navigator.userAgent;
        if (ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1) {
            this.content.insertBefore(ieWarning, this.content.firstChild);
        }

        if (window.screen.width < 1024) {
            this.content.insertBefore(resoultionWarning, this.content.firstChild);
        }

        return this;
    }
};

CustomCoverView.Prototype.prototype = CoverView.prototype;
CustomCoverView.prototype = new CustomCoverView.Prototype();
CustomCoverView.prototype.constructor = CustomCoverView;

module.exports = CustomCoverView;
