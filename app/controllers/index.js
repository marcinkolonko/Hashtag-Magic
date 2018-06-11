var _args = $.args;
var _dialogCtrl;

(function(){
	$.appVersion.text = 'v' + Ti.App.version + (ENV_TEST || ENV_DEV ? '-' + Ti.App.Properties.getString('app-version-code') : '');

	if(OS_IOS) $.alertDialog.style = Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT;

	Alloy.Collections.hashtags.on('change', toggleEmpty);
	Alloy.Collections.hashtags.trigger('change');

	filterByGroup();

	$.favoritesDropdown.setSelected(Alloy.Collections.groups.where({flagSelected:1}).map(function(group){
		return group.get('name');
	}).join(', '));
	$.index.open();
})();

function onPostLayout(e)
{
	$.index.removeEventListener('postlayout', onPostLayout);
	$.imgLogo.animate({
		opacity:1,
		duration:500,
		delay:500
	});

	$.hashtagBox.height = $.hashtagBox.size.height - 16;
	toggleEmpty();
}

function onCreateHashtag(e)
{
	var s = e.data.replace(/([A-Za-z0-9])(?=#)/g, '$1 ').replace(/[^A-Za-z0-9 ._]/g, '').replace(/  +/g, ' ');
	var a = s.split(' ');
	a.forEach(function(tag, idx){
		if(tag.indexOf('#') === 0){
			tag = tag.substring(1);
		}
		createHashtag(tag);
	});
	Alloy.Collections.hashtags.trigger('change');
}

function createHashtag(tag)
{
	if(Alloy.Collections.hashtags.where({name:tag}).length < 1){
		var model = Alloy.createModel('Hashtag').save({name:tag});
		Alloy.Collections.hashtags.add(model, {silent:true});

		Alloy.Collections.groups.where({flagSelected:1}).forEach(function(group){
			Alloy.createModel('HashtagGroup_Hashtag').save({tagId:model.id,groupId:group.id});
		});
	}
}

function toggleEmpty(n)
{
	n = Alloy.Collections.hashtags.length;

	if(n > 0 && $.imgEmptyHashtag.visible){
		$.imgEmptyHashtag.visible = false;
		$.imgEmptyHashtag.opacity = 0;
		$.hashtagBox.remove($.imgEmptyHashtag);
	}
	else{
		$.imgEmptyHashtag.visible = true;
		$.imgEmptyHashtag.animate({
			opacity:0.05,
			duration:200
		});
	}
}

function onShowFavorites(e)
{
	openGropDialog('select');
}

function onOpenSaveToGroupDialog(e)
{
	openGropDialog('save');
}

function openGropDialog(mode)
{
	$.hashtagInput.blur();
	_dialogCtrl = Alloy.createController('FavoriteGroupDialog',{
		mode:mode
	});
	_dialogCtrl.on('close', onCloseGroupDialog, $);
	$.index.add(_dialogCtrl.getView());
}

function onCloseGroupDialog(e)
{
	$.index.remove(_dialogCtrl.getView());
	_dialogCtrl.off();
	_dialogCtrl.cleanup();
	_dialogCtrl = null;

	var groups = Alloy.Collections.groups.where({flagSelected:1});
	if(groups.length > 0){
		$.favoritesDropdown.setSelected(groups.map(function(group){
			return group.get('name');
		}).join(', '));
	}
	else{
		$.favoritesDropdown.setSelected();
	}

	filterByGroup();
}

function filterByGroup()
{
	var groupsSelected = Alloy.Collections.groups.where({flagSelected:1});
	if(groupsSelected.length > 0){
		Alloy.Collections.hashtags.fetch({
			query: 'select * from Hashtag as tag where tag.alloy_id in (select tagId from HashtagGroup_Hashtag where groupId in (select alloy_id from HashtagGroup where flagSelected=1))',
		});
	}
	else{
		Alloy.Collections.hashtags.fetch();
	}
}
