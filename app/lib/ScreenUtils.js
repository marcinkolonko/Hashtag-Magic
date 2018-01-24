var Measure = require('alloy/measurement');

(function(){
	exports.getWidth = getWidth;
	exports.getHeight = getHeight;
	exports.getHeightWithoutStatusbar = getHeightWithoutStatusbar;
	exports.isLong = isLong;
})();

/**
 * returns screen width in device indipendent pixel
 */
function getWidth()
{
	return _toDP(Ti.Platform.displayCaps.platformWidth);
}

/**
 * returns screen height in device indipendent pixel
 * inkl. StatusBar, on android without NavigationBar
 */
function getHeight()
{
	return _toDP(Ti.Platform.displayCaps.platformHeight);
}

/**
 * returns screen height in device indipendent pixel
 * excl. StatusBar, on android without NavigationBar
 */
function getHeightWithoutStatusbar()
{
	return _toDP(Ti.Platform.displayCaps.platformHeight) - Alloy.Globals.Dimensions.STATUSBAR;
}

function isLong()
{
	var ratio = getHeight() / getWidth();
	
	return ratio > 1.65 || false;
}

function _toDP(n)
{
	if(OS_ANDROID)
	{
		return Measure.pxToDP(n);
	}
	
	return n;
}
