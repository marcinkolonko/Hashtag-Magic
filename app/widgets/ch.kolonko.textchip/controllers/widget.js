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
			var db = Ti.Database.open('_alloy_');
			try{
				groups.forEach(function(group){
					db.execute('DELETE FROM HashtagGroup_Hashtag WHERE groupId="' + group.id + '" AND tagId="' + _model.id + '";');
				});
				Alloy.Collections.hashtags.remove(_model);
			}
			catch(e){}
			finally{
				db.close();
			}
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
