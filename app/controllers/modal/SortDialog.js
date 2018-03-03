var _args = $.args;
var _startDrag;

(function(){
	$.toolbar.setTitle('Order hashtags');
	$.toolbar.addRightIcons([
		{path:'/images/ic_close_black_24dp.png',id:1}
	], function(btnId){
		$.SortDialog.close();
	});
	
	saveSortKeys();
	Alloy.Collections.hashtags.trigger('change');
})();

function onClose(e)
{
	$.toolbar.cleanup();
	
	Dispatcher.off(null,null,$);
	$.off();
	$.destroy();
}

function onMoveDown(e)
{
	var tag = Alloy.Collections.hashtags.get(e.data);
	var sortKey = tag.get('sortKey');
	
	if(sortKey < Alloy.Collections.hashtags.length - 2){
		var tag2 = Alloy.Collections.hashtags.at(sortKey + 1);
		var db = Ti.Database.open('_alloy_');
		db.execute('BEGIN');
		db.execute('update Hashtag set sortKey=? where alloy_id=?',sortKey + 1,tag.id);
		db.execute('update Hashtag set sortKey=? where alloy_id=?',sortKey,tag2.id);
		db.execute('COMMIT');
		db.close();
		
		Alloy.Collections.hashtags.fetch();
	}
}

function onMoveUp(e)
{
	var tag = Alloy.Collections.hashtags.get(e.data);
	var sortKey = tag.get('sortKey');
	
	if(sortKey > 0){
		var tag2 = Alloy.Collections.hashtags.at(sortKey - 1);
		var db = Ti.Database.open('_alloy_');
		db.execute('BEGIN');
		db.execute('update Hashtag set sortKey=? where alloy_id=?',sortKey - 1,tag.id);
		db.execute('update Hashtag set sortKey=? where alloy_id=?',sortKey,tag2.id);
		db.execute('COMMIT');
		db.close();
		
		Alloy.Collections.hashtags.fetch();
	}
}

function dataFilter(col)
{
	var selected = col.where({flagSelected:1});
	if(selected.length > 0){
		selected.unshift({template:'top-margin'});
	}
	
	return selected.length > 0 ? selected : col.models;
}

function dataTransform(model)
{
	var index = Alloy.Collections.hashtags.indexOf(model);
	
	model = model.toJSON();
	model.top = index == 0 ? 16 : 0;
	model.bottom = index == Alloy.Collections.hashtags.length - 1 ? 16 : 10;
	return model;
}

function saveSortKeys()
{
	var counter = 0;
	var db = Ti.Database.open('_alloy_');
	db.execute('BEGIN');
	
	var rs = db.execute('select * from Hashtag order by sortKey');
	while(rs.validRow){
		db.execute('update Hashtag set sortKey=? where alloy_id=?', [counter,rs.fieldByName('alloy_id')]);
		counter++;
		rs.next();
	}
	rs.close();
	
	db.execute('COMMIT');
	db.close();
}


