var _args = $.args;
var _dialogCtrl;

(function(){
	$.appVersion.text = 'v' + Ti.App.version + (ENV_TEST || ENV_DEV ? '-' + Ti.App.Properties.getString('app-version-code') : '');
	
	$.index.addEventListener("android:back", function(e){
		e.cancelBubble = true;
		
		if(Alloy.Globals.Backstack.length < 1){
			$.index.close();
		}
		else{
			(Alloy.Globals.Backstack.pop())();
		}
	});
	
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
	var model = _.find(Alloy.Collections.hashtags.models, function(model){
		return model.get('label') === tag;
	});
	if(model === undefined){
		model = Alloy.createModel('Hashtag',{label:tag});
		model.save();
		console.log(model.id);
		Alloy.Collections.hashtags.add(model, {silent:true});
		
		Alloy.Collections.groups.where({flagSelected:true}).forEach(function(group){
			group.save({tag_ids:group.get('tag_ids') + ',' + model.id});
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
	
	filterByGroup();
	var groups = Alloy.Collections.groups.where({flagSelected:1});
	if(groups.length > 0){
		$.favoritesDropdown.setSelected(groups.map(function(group){
			return group.get('name');
		}).join(', '));
	}
	else{
		$.favoritesDropdown.setSelected();
	}
	
	Alloy.Collections.hashtags.trigger('change');
}

function filterByGroup()
{
	// TODO: keep selection
	/*var hashmap = Alloy.Collections.hashtags.where({flagSelected:1}).reduce(function(dict, tag){
		dict[tag.id] = true;
		return dict;
	},{});*/
	
	var groupsSelected = Alloy.Collections.groups.where({flagSelected:1});
	if(groupsSelected.length > 0){
		var ids = groupsSelected.reduce(function(all, model){
			if(model.has('tag_ids')) all += model.get('tag_ids') + ',';
			return all;
		},'');
		ids = '"' + ids.slice(0,-1).replace(/,/g, '","') + '"';
		
		Alloy.Collections.hashtags.fetch({
			query: 'select * from Hashtag where alloy_id in (' + ids + ')',
			error:function(){
				Alloy.Collections.hashtags.fetch();
			}
		});
	}
	else{
		Alloy.Collections.hashtags.fetch();
	}
}



