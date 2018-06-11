var _args = arguments[0] || {};
var _model = Alloy.Collections.hashtags.get(_args.modelId);

(function(){
	$.setLabel = setLabel;
	$.applyProperties = applyProperties;
	
	if(_args.label) setLabel(_args.label);
	$.chip.backgroundColor = _model.get('flagSelected') == false ? Alloy.Globals.Colors.CHIP_BACKGROUND : '#ffff58';
})();

function onClick(e)
{
	if(_model){
		var flag = _model.get('flagSelected') == false ? 1 : 0;
		_model.save({flagSelected:flag});
		
		addToClipboard();
	}
}

function addToClipboard()
{
	Ti.UI.Clipboard.setText(Alloy.Collections.hashtags.where({flagSelected:1}).reduce(function(total, model){
		return total + '#'+model.get('name') + ' ';
	}, ''));
}

/**
 * set chip label
 * @param {String} value
 */
function setLabel(value)
{
	$.label.text = value;
	$.chip.width = Measure.pxToDP($.chip.toImage().width);
}

function applyProperties(params)
{
	$.chip.applyProperties(params);
}
