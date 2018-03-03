/**
 * represents a toolbar on android and ios
 * possible xml attributes are:
 *   theme: light/dark, default: light
 *   extended: trueish/falseish
 *   tabs: trueish/falseish
 *   translucentStatus: trueish/falseish
 * 
 * if any is omitted, property falls back to falseish.
 */

var ScreenUtils = require('ScreenUtils');
var _args = arguments[0] || {};
var _enumToolbar = require(WPATH('enum/EnumToolbar')).enum;
var _cbClickLeft;
var _cbClickRight;
var _cbClickTabs;
var _flagResizing = false;

(function constructor(){
	_args.theme = _args.theme || 'dark';
	
	var toolbarHeight = Alloy.Globals.Dimensions.STATUSBAR_HEIGHT;
	if(OS_ANDROID){
		if(_args.translucentStatus){
			$.addClass($.statusbar, 'toolbar__statusbar--translucent');
		}
		else{
			toolbarHeight = 0;
			$.appbarRight.top = 0;
			$.appbarLeft.top = 0;
			$.toolbarTitle.top = 0;
			$.toolbar.remove($.statusbar);
		}
	}
	if(_args.extended){
		toolbarHeight += Alloy.Globals.Dimensions.APPBAR_EXTENDED_HEIGHT;
		$.toolbarTitle.top += Alloy.Globals.Dimensions.APPBAR_HEIGHT;
		$.toolbarTitle.height = 72;
		$.addClass($.labelTitle, 'title__title-label--extended');
	}
	else{
		toolbarHeight += Alloy.Globals.Dimensions.APPBAR_HEIGHT;
	}
	$.toolbar.height = toolbarHeight;
	
	if(_args.theme === 'dark'){
		$.addClass($.labelTitle, 'title__title-label--light');
	}
	
	if(!_args.tabs)
	{
		$.toolbar.remove($.toolbarTabs);
		$.toolbarTabs = null;
	}
})();

/**
 * @param string title
 * @param string subtitle
 */
function setTitle(title,subtitle)
{
	if(subtitle){
		var withSubtitle = title + '\n' + subtitle;
		var attr = Ti.UI.createAttributedString({
		    text: withSubtitle,
		    attributes: [
		        {
		            type: Ti.UI.ATTRIBUTE_FONT,
		            value: { fontSize: Alloy.Globals.Font.TITLE, fontFamily: 'Roboto-Medium' },
		            range: [withSubtitle.indexOf(title), title.length]
		        },{
		            type: Ti.UI.ATTRIBUTE_FONT,
		            value: { fontSize: Alloy.Globals.Font.BODY, fontFamily: 'Roboto-Regular' },
		            range: [withSubtitle.indexOf(subtitle), subtitle.length]
		        }
		    ]
		});
		$.labelTitle.attributedString = attr;
	}
	else{
		$.labelTitle.text = title;
	}
}

/**
 * @Param imgPath path to image, like: /path/image.png 
 */
function setTitleImage(imgPath)
{
	$.toolbarTitle.remove($.labelTitle);
	var img = Ti.UI.createImageView({image:imgPath});
	$.toolbarTitle.add(img);
}

/**
 * @param {Object} icon => {path:'/path/image.png'}
 * @param function clickCallback
 */
function addLeftIcon(icon, clickCallback)
{
	_cbClickLeft = clickCallback || function(){};
	
	$.appbarLeft.width = Ti.UI.SIZE;
	$.appbarLeft.visible = true;
	
	if(!_args.extended){
		$.labelTitle.left = 70;
	}
	
	$.leftIcon.add(transformIcons([icon]));
}

/**
 * @param [array] icons => [{path:'/path/image.png',id:integer}]
 * @param {function} clickCallback
 */
function addRightIcons(icons, clickCallback)
{
	_cbClickRight = clickCallback || function(){};

	$.appbarRight.width = Ti.UI.SIZE;
	$.appbarRight.visible = true;
	
	$.rightIcons.add(transformIcons(icons));
}

/**
 * @param [array] tabs => [{tab:'string',id:integer}]
 * @param {function} clickCallback
 */
function addTabs(tabs, clickCallback)
{
	_cbClickTabs = clickCallback || function(){};	
	var tabWidth = calculateTabWidth(tabs);
	
	tabs.forEach(function(vo)
	{
		vo.tabWidth = tabWidth;
	});
	
	$.tabs.add(tabs);
}

/**
 * 
 */
function getHeight()
{
	return $.toolbar.height;
}

/**
 * 
 */
function resizeToolbar(toolbarNow)
{
	var titleHeight;
	var titleTop = 0;
	var toolbarHeight = 0;
	if(OS_IOS || OS_ANDROID && _args.translucentStatus){
		toolbarHeight = Alloy.Globals.Dimensions.STATUSBAR_HEIGHT;
		titleTop = Alloy.Globals.Dimensions.STATUSBAR_HEIGHT;
	} 
	
	if(toolbarNow === _enumToolbar.CONTRACTED){
		toolbarHeight += Alloy.Globals.Dimensions.APPBAR_EXTENDED_HEIGHT;
		titleHeight = 72;
		titleTop += Alloy.Globals.Dimensions.APPBAR_HEIGHT;
	}
	else{
		toolbarHeight += Alloy.Globals.Dimensions.APPBAR_HEIGHT;
		titleHeight = Alloy.Globals.Dimensions.APPBAR_HEIGHT;
	}
	
	if(!_flagResizing){
		_flagResizing = true;
		$.toolbar.animate({
			height: toolbarHeight,
			duration: 200
		},function(){
			_flagResizing = false;
		});
		$.toolbarTitle.animate({
			height: titleHeight,
			top: titleTop,
			duration: 200
		});
	}
}

function calculateTabWidth(tabs)
{
	var tabWidth = ScreenUtils.getWidth() / tabs.length;
	
	var totalWidth = tabs.reduce(function(max, tab)
	{
		var label = Ti.UI.createLabel({text:tab.tab});
		return max + label.toImage().getWidth();
	}, 0);
	
	if(totalWidth > ScreenUtils.getWidth())
	{
		tabWidth = Ti.UI.SIZE;
	}
	
	return tabWidth;
}

function transformIcons(icons)
{
	icons.forEach(function(vo)
	{
		vo.path = WPATH(vo.path);
	});
	
	return icons;
}

function onClickRightIcon(e)
{
	_cbClickRight(e.source.btnId);
}

function onClickLeftIcon(e)
{
	_cbClickLeft();
}

function onClickTab(e)
{
	_cbClickTabs(e.source.tabId);
}

/**
 * removes all dependencies to prevent memory leaks 
 */
function cleanup()
{
	Dispatcher.off(null,null,$);
	$.off();
	$.destroy();
}

$.setTitle = setTitle;
$.addLeftIcon = addLeftIcon;
$.addRightIcons = addRightIcons;
$.setTitleImage = setTitleImage;
$.addTabs = addTabs;
$.getHeight = getHeight;
$.resizeToolbar = resizeToolbar;
$.cleanup = cleanup;
