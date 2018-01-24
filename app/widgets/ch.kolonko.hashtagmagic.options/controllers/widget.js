var _args = arguments[0] || {};

(function(){
	$.clipbaordIconWidget.applyProperties({
		icon:{
			right:0,
			backgroundColor: Alloy.Globals.Colors.ACCENT,
			touchFeedbackColor: Alloy.Globals.Colors.SECONDARY_LIGHT
		},
		label:{
			font:{
				fontSize: Alloy.Globals.Font.HEADLINE,
				fontFamily: 'MaterialIcons-Regular'
			},
			color: Alloy.Globals.Colors.PRIMARY,
			text: '\ue14d'
		}
	});
	$.favoriteIconWidget.applyProperties({
		icon:{
			left:0,
			backgroundColor: Alloy.Globals.Colors.PRIMARY,
			touchFeedbackColor: Alloy.Globals.Colors.PRIMARY_LIGHT
		},
		label:{
			font:{
				fontSize: Alloy.Globals.Font.HEADLINE,
				fontFamily: 'MaterialIcons-Regular'
			},
			color: 'white',
			text: '\ue87d'
		}
	});
	$.resetIconWidget.applyProperties({
		icon:{
			left:0,
			backgroundColor: Alloy.Globals.Colors.PRIMARY,
			touchFeedbackColor: Alloy.Globals.Colors.PRIMARY_LIGHT
		},
		label:{
			font:{
				fontSize: Alloy.Globals.Font.HEADLINE,
				fontFamily: 'MaterialIcons-Regular'
			},
			color: 'white',
			text: '\ue14c'
		}
	});
	$.deleteIconWidget.applyProperties({
		icon:{
			left:0,
			backgroundColor: Alloy.Globals.Colors.PRIMARY,
			touchFeedbackColor: Alloy.Globals.Colors.PRIMARY_LIGHT
		},
		label:{
			font:{
				fontSize: Alloy.Globals.Font.HEADLINE,
				fontFamily: 'MaterialIcons-Regular'
			},
			color: 'white',
			text: '\ue872'
		}
	});
	$.stopIconWidget.applyProperties({
		icon:{
			left:0,
			visible: false,
			backgroundColor: 'red',
			touchFeedbackColor: 'pink'
		},
		label:{
			font:{
				fontSize: Alloy.Globals.Font.HEADLINE,
				fontFamily: 'MaterialIcons-Regular'
			},
			color: 'white',
			text: '\ue14b'
		}
	});
	
	showOptions();
})();


function onCopyToClipboard(e)
{
	Ti.UI.Clipboard.setText(Alloy.Collections.hashtags.where({flagSelected:1}).reduce(function(total, model){
		return total + '#'+model.get('label') + ' ';
	}, ''));
	reset();
}

function onSaveToGroup(e)
{
	if(Alloy.Collections.hashtags.where({flagSelected:1}).length > 0){
		$.trigger('save');
	}
	else{
		Ti.UI.createAlertDialog({
			title: L('dialog_not_valid_hashtag_title'),
			message: L('dialog_not_valid_hashtag_message'),
			ok: L('btn_ok')
		}).show();
	}
}

function onReset(e)
{
	Ti.UI.Clipboard.clearText();
	reset();
}

function onStartDelete(e)
{
	Ti.UI.Clipboard.clearText();
	Alloy.Globals.flagDelete = true;
	Alloy.Collections.hashtags.trigger('change');
	
	$.deleteIconWidget.reset(true);
	$.stopIconWidget.getView().left = 96;
	$.stopIconWidget.getView().visible = true;
}

function onStopDelete(e)
{
	Alloy.Globals.flagDelete = false;
	Alloy.Collections.hashtags.trigger('change');
	
	setTimeout(function(){
		$.stopIconWidget.reset(true);
		$.deleteIconWidget.getView().left = 96;
		$.deleteIconWidget.getView().visible = true;
	},300);
}

function reset()
{
	Alloy.Collections.hashtags.where({flagSelected:1}).forEach(function(tag){
		tag.set({flagSelected:0},{silent:true});
	});
	Alloy.Collections.hashtags.trigger('change');
}

function showOptions()
{
	$.options.visible = true;
	
	setTimeout(function(){
		$.resetIconWidget.getView().left = 44;
	},200);
	setTimeout(function(){
		$.deleteIconWidget.getView().left = 96;
	},400);
}
