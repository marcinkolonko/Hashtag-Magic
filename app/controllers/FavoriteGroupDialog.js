var _args = $.args || {};
var _selected;

(function(){
	$.cleanup = cleanup;
	
	Alloy.Globals.Backstack.push(androidBack);
	
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
		label: model.name
	};
}

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
		m.set({flagSelected:m.get('flagSelected') ? 0 : 1});
	}
}

function onCreateGroup(e)
{
	if(e.data){
		var m = Alloy.createModel('HashtagGroup', {name:e.data});
		m.save();
		Alloy.Collections.groups.unshift(m);
		updateLayout();
	}
}

function onSave()
{
	if(_args.mode === 'save'){
		var ids = Alloy.Collections.hashtags.where({flagSelected:1}).map(function(tag){
			return tag.id;
		}).join(',');
		Alloy.Collections.groups.where({flagSelected:1}).forEach(function(model){
			model.save({tag_ids:ids});
		});
	}
	hide();
}

function onCancel(e)
{
	reset();
	hide();
}

function updateLayout()
{
	var h = (Alloy.Collections.groups.length * 40) + 200;
	if(h > ScreenUtils.getHeight() - (2*56)){
		h = ScreenUtils.getHeight() - Alloy.Globals.Dimensions.STATUSBAR - (2*56);
	}
	$.dialogContent.height = h;
}

function toggleEmpty()
{
	Alloy.Collections.groups.reset({
		role:'empty',
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
