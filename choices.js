var Choices=React.createClass({
	propTypes:{
		data:React.PropTypes.array.isRequired
		,selected:React.PropTypes.number
		,onSelect:React.PropTypes.func
		,type:React.PropTypes.string
		,checked:React.PropTypes.bool
		,labelfor:React.PropTypes.bool
	},
	selected:0, //might receive from parent in the future
	renderTab:function(item,idx) {
		var disabled=item.disabled ? " disabled":"";
		var disabled_label=item.disabledLabel ? " disabled":"";
		var checked=(this.selected==idx) || this.props.checked;
		var theinput=React.createElement("input", {type: this.props.type||"radio", 
				defaultChecked:checked, className:disabled.trim(),name: "tagsettab", value: item.name}); 

		var thelabel=React.createElement("span", 
			{className:"tagsetlabel "+disabled_label.trim()}, item.label);

		var labelfor=(this.props.labelfor)?React.createElement("label", null, theinput,thelabel):[theinput,,thelabel];
		return React.createElement("span", {"data-n": idx, 
			className:(this.props.type||"radio")+"inline"+disabled+disabled_label}, labelfor);
	},
	select:function(e) {
		var target=e.target;
		while (target) {
			if (target.dataset&& target.dataset.n)	 break;
			else  target=target.parentNode;
		}
		if (!target) return;
		if (target.classList.contains("disabledLabel") || target.classList.contains("disabled")) {
			e.preventDefault();
			return;
		}
		var n=parseInt(target.dataset.n);
		if (this.selected!=n) {
			if (this.props.onSelect) this.props.onSelect(n, this.selected); //newly selected, previous selected
			this.selected=n;
		}
	},	
	render:function(){
		return React.createElement("div", {onClick: this.select}, 
			(this.props.data ||[]).map(this.renderTab)
		);
	}
})
module.exports=Choices;