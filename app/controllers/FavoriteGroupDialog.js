var _args = $.args || {};
var _selected;

(function(){
	$.cleanup = cleanup;
	
	Alloy.Globals.Backstack.push(androidBack);
	Alloy.Collections.group_tag.fetch();
	
	if(Alloy.Collections.groups.length < 1){
		toggleEmpty();
	}
	else{
		_selected = Alloy.Collections.groups.where({flagSelected:1}).reduce(function(lookup, model){
			lookup[model.id] = true;
			return lookup;
		},{});
		
		Alloy.Collections.groups.trigger('change');
	}
	
	$.btnOk.text = L('btn_ok').toUpperCase();
	$.btnCancel.text = L('btn_cancel').toUpperCase();
	
	updateLayout();
})();

function onSelectOption(e)
{
	if(e.source.bindId === 'deleteIcon'){
		Alloy.Collections.groups.at(e.itemIndex).destroy();
		if(Alloy.Collections.groups.length < 1){
			toggleEmpty();
			updateLayout();
		}
	}
	else{
		var m = Alloy.Collections.groups.at(e.itemIndex);
		m.save({flagSelected:m.get('flagSelected') ? 0 : 1});
	}
}

function onCreateGroup(e)
{
	if(e.data){
		var model = {
			name: e.data
		};
		if(Alloy.Collections.hashtags.where({flagSelected:1}).length > 0){
			model.flagSelected = 1;
		}
		var m = Alloy.createModel('HashtagGroup', model);
		m.save();
		
		if(Alloy.Collections.groups.length === 1 && Alloy.Collections.groups.at(0).get('template') === 'empty-group-tmpl'){
			Alloy.Collections.groups.reset([m]);
		}
		else{
			Alloy.Collections.groups.unshift(m);
		}
		
		updateLayout();
	}
}

function onSave()
{
	Alloy.Collections.groups.where({flagSelected:1}).forEach(function(group){
		Alloy.Collections.hashtags.where({flagSelected:1}).forEach(function(tag){
			Alloy.Collections.group_tag.fetch({
				query: 'select * from HashtagGroup_Hashtag where groupId="' + group.id + '" and tagId="' + tag.id + '"',
				success: function(col, resp){
					if(col.length < 1){
						Alloy.createModel('HashtagGroup_Hashtag',{groupId:group.id,tagId:tag.id}).save();
					}
				}
			});
		});
	});
	
	hide();
}

function onCancel(e)
{
	reset();
	hide();
}

function androidBack()
{
	reset();
	$.trigger('close');
}

function dataTransform(model)
{
	model = model.toJSON();
	
	var tmpl = model.template;
	if(!tmpl){
		if(_args.mode === 'select'){
			tmpl = model.flagSelected ? 'group-selected-tmpl' : 'group-delete-tmpl';
		}
		else{
			tmpl = model.flagSelected ? 'group-selected-tmpl' : 'group-tmpl';
		}
	}
	
	return {
		template: tmpl,
		name: model.name
	};
}

function updateLayout()
{
	var h = (Alloy.Collections.groups.length * 40) + 60 + 60;
	if(h < 250) h = 250;
	
	var hMax = ScreenUtils.getHeight() - Alloy.Globals.Dimensions.STATUSBAR - (2*56);
	if(h > hMax) h = hMax;
	
	console.log('*** height: ' + h);

	$.dialogContent.height = h;
}

function toggleEmpty()
{
	Alloy.Collections.groups.reset({
		template:'empty-group-tmpl'
	});
}

function reset()
{
	if(Alloy.Collections.groups.at(0).has('role')){
		Alloy.Collections.groups.reset();
	}
	else{
		_selected = _selected || {};
		console.log(_selected);
		Alloy.Collections.groups.forEach(function(group){
			group.set({flagSelected:_selected[group.id] ? 1 : 0});
		});
	}
}

function hide()
{
	Alloy.Globals.Backstack.pop();
	$.trigger('close');
}

function cleanup()
{
	Dispatcher.off(null,null,$);
	$.off();
	$.destroy();
}
