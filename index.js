(function(){
    
"use strict";

// constructor
function TouchPicGallery(el, opts){
    this.el = $(el);
    
    this.childClass = 'pic';
    this.childWidth = this.childWidth;
    
    $.extend(this, opts);
    
    this.children = this.el.find('.'+this.childClass);
    this.count = (this.children.length - 1) * -1;
    
    this.start = 0;
    this.diff = 0;
    this.startTime;
    this.endTime;
    this.relativeStart = 0;
    this.relativeDiff = 0;
    this.index = 0;
    this.ticking = false;
    
    this.setPositions();
    this.addListeners();
    
}

TouchPicGallery.prototype.setPositions = function(){
    this.children.each($.proxy(function(index, el) {
        $(el).css('left', index * this.childWidth);
    }, this));
}

TouchPicGallery.prototype.addListeners = function(){
    this.el.on(
        'touchstart',
        $.proxy(this.onTouchStart, this)
        
    );
    this.el.on(
        'touchmove',
        $.proxy(this.onTouchMove, this)
    );
    this.el.on(
        'touchend',
        $.proxy(this.onTouchEnd, this)
    );
}

TouchPicGallery.prototype.onTouchStart = function(e){
    e.preventDefault();
    this.start = e.changedTouches[0].pageX - this.diff; 
    this.relativeStart = e.changedTouches[0].pageX;
    this.startTime = Date.now();
};

TouchPicGallery.prototype.onTouchMove = function(e){
    e.preventDefault();
    this.diff = e.changedTouches[0].pageX - this.start;
    this.relativeDiff = e.changedTouches[0].pageX - this.relativeStart;
    this.requestAnimationFrame(this.update);
}

TouchPicGallery.prototype.onTouchEnd = function(e){
    this.endTime = Date.now();
    var oldIndex = this.index;
    this.index = Math.round(this.diff / this.childWidth);
    var momentum = (Math.abs(this.relativeDiff)) / (this.endTime - this.startTime);
    if(momentum > .3 && oldIndex === this.index){
        if(this.relativeDiff > 0){
           this.index++; 
           this.el.addClass('fast_animate');
        }
        else{
            this.index--;
            this.el.addClass('fast_animate');
        }
    }
    if(this.index > 0){
        this.index = 0;
    }
    if(this.index < this.count){
        this.index = this.count;
    }
    this.el.addClass('animate');
    this.el.on('webkitTransitionEnd', $.proxy(this.transtionEnd, this));
    this.requestAnimationFrame(
        function(){
            this.el.css('-webkit-transform', 'translate('+this.index * this.childWidth+'px, 0)');
        }
    );
}

TouchPicGallery.prototype.transtionEnd = function(e){
    this.el.off('webkitTransitionEnd');
    this.el.removeClass('animate');
    this.el.removeClass('fast_animate');
    this.diff = this.index * this.childWidth;
    this.el.trigger(
        'notch',
        {
            'notch': Math.abs(this.index)
        }
    );
}

TouchPicGallery.prototype.requestAnimationFrame = function(func){
    var rAF = window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
    if(rAF){
        rAF($.proxy(func, this));
    }
    else{
        setTimeout(
            $.proxy(
                function(){
                    func.call(this);
                },
                this
            ), 
            10
        );
    }
}


TouchPicGallery.prototype.update = function() {
    this.ticking = false;
	this.el.css('-webkit-transform', 'translate('+this.diff+'px, 0)');
}


// check if we've got require
if(typeof module !== "undefined"){
    module.exports = TouchPicGallery;
}
else{
    window.TouchPicGallery = TouchPicGallery;
}

}()); // end wrapper
