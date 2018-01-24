var _args = arguments[0] || {};
var _onClickCallback;

(function constructor(){
	$.clear = clear;
	$.blur = blur;
	
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
			color: Alloy.Globals.Colors.PRIMARY,
			text: '\ue145'
		}
	});
	
	if(_args.hint){
		$.textField.hintText = L(_args.hint).toUpperCase();
	}
	else{
		$.textField.hintText = L('ch_kolonko_hashtagmagic_hint_hashtag').toUpperCase();
	}
})();

function onClick(e)
{
	$.trigger('click',{data:$.textField.value});
	clear();
}

function onFocus(e)
{
	$.trigger('inputFocus');
}

/**
 * clear input field 
 */
function clear()
{
	$.textField.value = '';
}

/**
 * blur input field 
 */
function blur()
{
	$.textField.blur();
}
