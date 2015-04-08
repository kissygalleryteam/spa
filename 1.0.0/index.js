function Spa(el){
    this.setElement(el);
    this.currentFrame = 0;
    this.rendered = false;
    this.path = [];
    this.init();
}

Spa.prototype.setElement = function(el) {
    if (typeof el == 'undefined') {
        throw new Error('SpaJS [constructor]: "el" parameter is required');
    };
    if (el.constructor == String) {
        el = document.getElementById(el);
        if (!el) {
            throw new Error('SpaJS [constructor]: "el" parameter is not related to an existing ID');
        };
    };
    if (el.constructor !== SVGSVGElement) {
        throw new Error('SpaJS [constructor]: "svg" element is required');
    }else{
        this.el = el;
        this.image = this.el.previousElementSibling;
    };
};

Spa.prototype.init = function() {
    var self = this;
    var paths = toArray(this.el.querySelectorAll('path'));
    paths.forEach(function(path,index){
        var len = path.getTotalLength();
        self.path[index] = {
            path: path,
            length: len
        };
        path.style.strokeDasharray = len +' '+ len;
        path.style.strokeDashoffset = len;
    });
};

Spa.prototype.render = function(image) {
    if (!this.rendered) {
        if (image && image.constructor == HTMLImageElement) {
            this.image = image;
        };
        this.rendered = true;
        this.draw();
    };
};

Spa.prototype.draw = function() {
    var self = this;
    var timer;
    (function(){
        var progress = self.currentFrame/60;
        if (progress <= 1) {
            self.path.forEach(function(o,index){
                o.path.style.strokeDashoffset = o.length*(1-progress);
            });
            timer = requestAnimFrame(arguments.callee);
            self.currentFrame++;
        } else{
            cancelAnimFrame(timer);
            self.show();
        };
    })();
};

Spa.prototype.show = function() {
    var self = this;
    var timer;
    var opacity = 0;
    (function(){
        if (opacity >= 100) {
            cancelAnimFrame(timer);
        }else{
            opacity += 2;
            self.image.style.opacity = opacity/100;
            timer = requestAnimFrame(arguments.callee);
        };
    })();

};

var toArray = function(obj){
    return Array.prototype.slice.call(obj);
}

var requestAnimFrame = function(){
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback){
            return window.setTimeout(callback,1000/60);
        }
    )
}();

var cancelAnimFrame = function(){
    return (
        window.cancelAnimitionFrame ||
        window.webkitCancelAnimitionFrame ||
        window.mozCancelAnimitionFrame ||
        window.oCancelAnimitionFrame ||
        window.msCancelAnimitionFrame ||
        function(id){
            return window.clearTimeout(id);
        }
    )
}();

module.exports = Spa;