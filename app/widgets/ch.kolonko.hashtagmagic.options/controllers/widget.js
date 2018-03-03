var _args = arguments[0] || {};

(function(){
	$.clipbaordIconWidget.applyProperties({
		icon:{
			right:0,
			backgroundColor: Alloy.Globals.Colors.ACCENT,
			touchFeedbackColor: Alloy.Globals.Colors.SECONDARY_LIGHT
		},
		label:{
			color: Alloy.Globals.Colors.PRIMARY,
			text: '\ue14d'
		}
	});
	$.favoriteIconWidget.applyProperties({
		icon:{
			left:0,
		},
		label:{
			color: '#fff',
			text: '\ue87d'
		}
	});
	$.filterIconWidget.applyProperties({
		icon:{
			left:0,
		},
		label:{
			color: '#fff',
			text: '\ue152'
		}
	});
	$.resetIconWidget.applyProperties({
		icon:{
			left:0,
		},
		label:{
			color: '#fff',
			text: '\ue14c'
		}
	});
	$.deleteIconWidget.applyProperties({
		icon:{
			left:0,
		},
		label:{
			color: '#fff',
			text: '\ue872'
		}
	});
	$.stopIconWidget.applyProperties({
		icon:{
			left:0,
			visible: false,
			backgroundColor: '#ff0000',
			touchFeedbackColor: 'pink'
		},
		label:{
			color: '#fff',
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

function onFilterTags(e)
{
	Alloy.createController('modal/SortDialog').getView().open();
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
	$.stopIconWidget.getView().left = 140;
	$.stopIconWidget.getView().visible = true;
}

function onStopDelete(e)
{
	Alloy.Globals.flagDelete = false;
	Alloy.Collections.hashtags.trigger('change');
	
	setTimeout(function(){
		$.stopIconWidget.reset(true);
		$.deleteIconWidget.getView().left = 140;
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
		$.filterIconWidget.getView().left = 44;
	},300);
	setTimeout(function(){
		$.resetIconWidget.getView().left = 88;
	},600);
	setTimeout(function(){
		$.deleteIconWidget.getView().left = 140;
	},900);
}
