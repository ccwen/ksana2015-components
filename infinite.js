var Infinite=require("react-infinite");
var React=require("react");
var E=React.createElement;
var itemClassName="infinite-list-item";
var ListItem = React.createClass({
    getDefaultProps: function() {
        return {
            height: 50,
            lineHeight: "50px"
        }
    },
    render: function() {
        return E("div",{className:itemClassName, style:{height: this.props.height,lineHeight: this.props.lineHeight}},
            "List Item"+this.props.index);
    }
});

var VariableInfiniteList = React.createClass({
    getInitialState: function() {
        return {
        	elements:[],
        	elementData:[],
            elementHeights: [],//this.generateVariableElementHeights(100),
            isInfiniteLoading: false
        };
    }
    ,componentWillReceiveProps:function(nextProps) {
    	if (nextProps.onLoad && nextProps.onLoad!=this.props.onLoad) {
    		setTimeout(function(){
    			this.handleInfiniteLoad();	
    		}.bind(this),1);
    		
    	}
    }
    ,componentDidMount:function() {
    	this.handleInfiniteLoad();
    }
    ,generateEmptyElementHeights: function(number) {
        var heights = [];
        for (var i = 0; i < number; i++) heights.push(50);
        return heights;
    },
    calculateHeight:function(newdata) {
      	//var root=
      	var div=document.createElement("div");
      	div.className=itemClassName;
      	div.style.visibility="hidden";
      	document.body.appendChild(div);

      	var now=this.state.elements.length;
      	var newHeights=[];
      	var elements=this.state.elements;
      	for (var i=0;i<newdata.length;i++) {
      		var ele=E(this.props.itemClass,{key:now+i,index:now+i,text:newdata[i]});
      		elements.push(ele);
      		React.render(ele , div,function(comp){
      			var h=this.getDOMNode().offsetHeight;
      			newHeights.push(h);
      		});
      	}
        this.setState({
            	elements:elements,
            	elementData:this.state.elementData.concat(newdata),
                isInfiniteLoading: false,
                elementHeights: this.state.elementHeights.concat(newHeights)
        });
        document.body.removeChild(div);

    }
    ,handleInfiniteLoad: function() {
        var that = this;
        this.setState({ isInfiniteLoading: true});

        if (this.props.onLoad) this.props.onLoad(this.state.elementHeights.length,function(newdata){
  			that.calculateHeight(newdata);
        });
    },
    elementInfiniteLoad: function() {
        return E("div",{className:itemClassName},"Loading...");
    },
    render: function() {
    	var itemClass=this.props.itemClass;
        var containerHeight=this.props.height;
        infiniteLoadBeginBottomOffset=containerHeight-50;
        return E(Infinite,{elementHeight:this.state.elementHeights,
                         containerHeight:containerHeight,
                         infiniteLoadBeginBottomOffset:infiniteLoadBeginBottomOffset,
                         onInfiniteLoad:this.handleInfiniteLoad,
                         loadingSpinnerDelegate:this.elementInfiniteLoad(),
                         isInfiniteLoading:this.state.isInfiniteLoading,
                         timeScrollStateLastsForAfterUserScrolls:1000}
                         ,this.state.elements);
    }
});

module.exports=VariableInfiniteList;