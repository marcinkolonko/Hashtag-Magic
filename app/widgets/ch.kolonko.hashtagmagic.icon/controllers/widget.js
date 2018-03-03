var _args = arguments[0] || {};

(function constructor(){
	$.applyProperties = applyProperties;
	$.toggleVisibility = toggleVisibility;
	$.reset = reset;
	
	if(_args.backgroundColor !== undefined){
		$.topView.backgroundColor = _args.backgroundColor;
	}
	if(_args.touchFeedbackColor !== undefined){
		$.topView.touchFeedbackColor = _args.touchFeedbackColor;
	}
	if(_args.icon){
		$.label.text = _args.icon;
	}
})();

function onClick(e)
{
	$.trigger('click', {data:_args.data});
}

/**
 * apply properties 
 * @param {Object} params
 * @param {Object} params.icon
 * @param {Object} params.label
 */
function applyProperties(params)
{
	params = params || {};
	
	if(params.icon){
		$.topView.applyProperties(params.icon);
	}
	if(params.label){
		$.label.applyProperties(params.label);
	}
}

function toggleVisibility()
{
	$.topView.visible = !$.topView.visible;
}

/**
 * @param {Boolean} value true for hide
 */
function reset(value)
{
	$.topView.left = 0;
	
	if(value){
		$.topView.visible = false;
	}
}
