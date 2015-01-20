/*http://jsfiddle.net/aabeL/1/ */

var SCROLL_TIMEOUT = 200;

// How often to check if we're scrolling; this is a reasonable default.
var CHECK_INTERVAL = SCROLL_TIMEOUT / 2;

var PageScrollStartEndMixin = {
    componentWillUnmount:function(){
    	this.getDOMNode().removeEventListener('wheel', this.onScroll, false);
    },
    componentDidMount: function() {
    	this.getDOMNode().addEventListener('wheel', this.onScroll, false);
        this.checkScrollInterval = setInterval(this.checkScroll, CHECK_INTERVAL);
        this.scrolling = false;
    },
    componentWillUnmount: function() {
        clearInterval(this.checkScrollInterval);
    },
    checkScroll: function() {
        if (Date.now() - this.lastScrollTime > SCROLL_TIMEOUT && this.scrolling) {
            this.scrolling = false;
            if (this.onScrollEnd) this.onScrollEnd();
        }
    },
    onScroll: function() {
        if (!this.scrolling) {
            this.scrolling = true;
            if (this.onScrollStart) this.onScrollStart();
        }
        this.lastScrollTime = Date.now();
    }
};

module.exports=PageScrollStartEndMixin;