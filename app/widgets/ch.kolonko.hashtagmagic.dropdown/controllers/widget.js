var _args = arguments[0] || {};

(function constructor(){
	$.setSelected = setSelected;
	
	if(_args.bottom !== undefined){
		$.topView.bottom = _args.bottom;
	}
	if(_args.top !== undefined){
		$.topView.top = _args.top;
	}
	
	$.iconWidget.applyProperties({
		icon: {
			right:0
		},
		label: {
			color:'white',
			text:'\ue313'
		}
	});
	
	setSelected();
})();

/**
 * change text to selected set 
 */
function setSelected(value)
{
	if(value){
		$.label.color = Alloy.Globals.Colors.TEXT_PRIMARY;
		$.label.text = value;
	}
	else{
		$.label.color = Alloy.Globals.Colors.TEXT_HINT;
		$.label.text = L('ch_kolonko_hashtagmagic_hint_favorites').toUpperCase();
	}
}

function _onClick(e)
{
	$.trigger('showFavorites');
}
