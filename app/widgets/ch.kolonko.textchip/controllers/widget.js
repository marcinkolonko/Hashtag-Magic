var _args = arguments[0] || {};
var _model = Alloy.Collections.hashtags.get(_args.modelId);

(function(){
	$.setLabel = setLabel;
	$.applyProperties = applyProperties;
	
	if(_args.label) setLabel(_args.label);
	if(Alloy.Globals.flagDelete === true) $.chip.backgroundColor = '#ff0000';
})();

function onClick(e)
{
	if(Alloy.Globals.flagDelete === true){
		var groups = Alloy.Collections.groups.where({flagSelected:1});
		if(groups.length > 0){
			var tagIds;
			groups.forEach(function(group){
				tagIds = group.get('tag_ids');
				tagIds = tagIds ? tagIds.split(',') : [];
				tagIds = tagIds.reduce(function(ids,id){
					if(id !== _model.id) ids.push(id);
					return ids;
				},[]);
				group.save({tag_ids:tagIds.join(',')});
			});
			Alloy.Collections.hashtags.remove(_model);
		}
		else{
			_model.destroy();
		}
	}
	else{
		if(_model){
			var flag = _model.get('flagSelected') === 0 ? 1 : 0;
			_model.set({flagSelected: flag}, {silent:true});
			
			if(flag === 1){
				$.chip.backgroundColor = '#ffff58';
			}
			else{
				$.chip.backgroundColor = Alloy.Globals.Colors.CHIP_BACKGROUND;
			}
			
			addToClipboard();
		}
	}
}

function addToClipboard()
{
	Ti.UI.Clipboard.setText(Alloy.Collections.hashtags.where({flagSelected:1}).reduce(function(total, model){
		return total + '#'+model.get('label') + ' ';
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
