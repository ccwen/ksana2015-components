var E=React.createElement;
var Choices=React.createClass({
	propTypes:{
		data:React.PropTypes.array.isRequired
		,selected:React.PropTypes.number
		,onSelect:React.PropTypes.func
		,onCheck:React.PropTypes.func
		,type:React.PropTypes.string
		,checked:React.PropTypes.bool
		,prefix:React.PropTypes.string
		,labelfor:React.PropTypes.bool
		,vposInItem:React.PropTypes.func //return vpos in each item(for rendering markup style)
	}
	,selected:0 //might receive from parent in the future
	,vposInItem:[]
	,getDefaultProps:function(){
		return {prefix:""};
	}
	,renderDropdownItem:function(item,idx) {
		var disabled=item.disabled ? " disabled":"";
		return (
			E("li",{key:"li"+idx},
			   E("a",{href:"#", onClick:this.select, "data-n":idx},item.label))
		);
	}
	,autovpos:function(str,item) { //do not use surrogate in desc
		var out=[];
		var startvpos=this.vpos;
		var samples=str.split("|")
		for (var j=0;j<samples.length;j++) {
			var s=samples[j];
			for (var i=0;i<s.length;i++) {
				var key="k"+j+"_"+i;
				var code=s.charCodeAt(i);
				out.push(E("span",{key:key,"data-vpos":this.vpos},str[i]));
				//if (code>=0x3400&&code<=0x9fff)	
				this.vpos++;
			}
			if (this.vpos>startvpos) this.vposInItem.push( [startvpos+2,this.vpos-startvpos-2,item.name, j] );
		}
		return E("span",{className:"markupdesc"},out);
	}
	,componentWillUpdate:function() {
		this.vposInItem=[];
	}
	,componentWillMount:function() {
		this.selected=this.props.selected;
	}
	,componentDidUpdate:function() {
		if (this.props.vposInItem) this.props.vposInItem(this.vposInItem);
	}
	,renderButton:function(item,idx) {
		var label=item.label;
		var disabled=item.disabled ? " disabled":"";
		if (this.props.hotkey && idx<10) {
			var hotkey=(idx+1).toString();
			if (hotkey.length>1) hotkey=hotkey.substr(1);
			label=hotkey+label;
		}

		var thelinebreak=null;
		if (this.props.linebreak) thelinebreak=E("br");		
		var theinput=React.createElement("button",{className:"btn btn-default markupbutton"+disabled,key:"b"+idx},label);		
		var description="",descriptionspans=null;
		if (item.desc) description += " "+item.desc;
		if (this.props.autovpos) descriptionspans=this.autovpos(description,item);
		else descriptionspans=E("span",{className:"markupdesc"},description);

		return E("span", {"data-n": idx,
			key:"t"+idx,className:(this.props.type||"radio")+"inline"+disabled}
			," ", theinput,descriptionspans,thelinebreak);

	}
	,onchange:function(e) {
		var target=e.target;
		while (target) {
			if (target.dataset&& target.dataset.n) break;
			else  target=target.parentNode;
		}
		if (!target) return;

		var n=parseInt(target.dataset.n);
		if (this.props.onCheck) this.props.onCheck(n,e.target.checked);
	}
	,renderCheckbox_radio:function(item,idx) {
		var checked=(this.selected==idx);
		if (this.props.type=="checkbox") checked=item.checked;
		var theinput=null;
		var key=this.props.prefix+"_i"+idx;
		theinput=React.createElement("input", {type: this.props.type||"radio", key:key, id:key,
				onChange: this.onchange, checked:checked,name: "tagsettab"}); 

		var thelabel=null;
		var thelabel=E("span", {key:"l"+idx,className:"tagsetlabel "}, item.label);

		var thelinebreak=null;
		if (this.props.linebreak) thelinebreak=E("br");

		var description="",descriptionspans=null;
		if (item.desc) description += " "+item.desc;
		if (this.props.autovpos) descriptionspans=this.autovpos(description,item);
		else descriptionspans=E("span",{className:"markupdesc"},description);

		var labelfor=(this.props.labelfor)?E("label", {"htmlFor":key}, theinput,thelabel):[theinput,thelabel];
		return E("span", {"data-n": idx,
			key:"t"+idx,className:" inline"}
			," ", labelfor,descriptionspans,thelinebreak);
	}
	,select:function(e) {
		var target=e.target;
		while (target) {
			if (target.dataset&& target.dataset.n) break;
			else  target=target.parentNode;
		}
		if (!target) return;
		if (target.classList.contains("disabledLabel") || target.classList.contains("disabled")) {
			e.preventDefault();
			return;
		}
		var n=parseInt(target.dataset.n);
		if (this.selected!=n || this.props.type=="button") {
			if (this.props.onSelect) this.props.onSelect(n, this.selected); //newly selected, previous selected
			this.selected=n;
		}
	}
	,renderItems:function(){
		var itemrenderer=this.renderCheckbox_radio;
		if (this.props.type=="button") itemrenderer=this.renderButton;
		return (this.props.data ||[]).map(itemrenderer);
	}
	,selectedLabel:function() {
		if (!this.props.data.length) return "";
		return this.props.data[this.selected].label;
	}
	,renderDropdown:function() {
		return E("div",{className:"dropdown"},
				E("button",{className:"dropdown-toggle", type:"button","data-toggle":"dropdown"},
				    this.selectedLabel(),
				    E("span",{className:"caret"})
				),
				E("ul",{className:"dropdown-menu",role:"menu"},
					(this.props.data ||[]).map(this.renderDropdownItem)
				)
			);
	}
	,render:function(){
		this.vpos=1;
		var renderItems=this.renderItems;
		if (this.props.type=="dropdown") renderItems=this.renderDropdown;
		return E("div", {onClick: this.select}, 
			renderItems()
		);
	}
})
module.exports=Choices;