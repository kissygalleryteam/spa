KISSY.add('kg/spa/1.0.0/index',[],function(S ,require, exports, module) {
 function Spa(el){
    this.el = null;
    this.targetEl = null;
    this.currentFrame = 0;
    this.rendered = false;
    this.path = [];
    this.setElement(el);
    this.init();
}

Spa.prototype.setElement = function(el) {
    el = check(el);
    if (el.__proto__.constructor === SVGSVGElement) {
        this.el = el;
    }else{
        throw new Error('[SpaJS]: `svg` element is required');
    };
};

Spa.prototype.setTargetElement = function(el) {
    el = check(el);
    if (el.__proto__ && el.__proto__.__proto__ && el.__proto__.__proto__.constructor === HTMLElement) {
        this.targetEl = el;
    }else{
        throw new Error('[SpaJS]: `target` element is must be the HTMLElement');
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

Spa.prototype.render = function(tSelector) {
    if (!this.rendered && this.el) {
        this.setTargetElement(tSelector || this.el.previousElementSibling);
        this.rendered = true;
        this.draw();
    };
};

Spa.prototype.draw = function() {
    var self = this;
    var timer;
    if (!this.path.length) return;
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
            self.targetEl && self.show();
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
            self.targetEl.style.opacity = opacity/100;
            timer = requestAnimFrame(arguments.callee);
        };
    })();

};

var toArray = function(obj){
    return Array.prototype.slice.call(obj);
}

var check = function(el){
    if (!el) {
        throw new Error('[SpaJS]: parameter is required');
    };
    if (el.constructor == NodeList || el.constructor == HTMLCollection) {
        if (el.length) {
            el = el[0];
        }else{
            throw new Error('[SpaJS]: the NodeList is not related to empty');
        }
    };
    if (el.constructor == String) {
        el = document.getElementById(el);
        if (!el) {
            throw new Error('[SpaJS]: parameter is not related to an existing ID');
        };
    };
    return el;
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
});