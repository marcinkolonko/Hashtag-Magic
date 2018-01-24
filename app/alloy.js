var Dispatcher = require('EventDispatcher');
var ScreenUtils = require('ScreenUtils');
var Measure = require('alloy/measurement');
var Moment = require('alloy/moment');
Moment.locale('de-CH');

Alloy.Globals.Elevation = {
	CARD: Measure.dpToPX(2),
	APPBAR: Measure.dpToPX(4),
	DIALOG: Measure.dpToPX(24)
};

Alloy.Globals.Dimensions = {
	STATUSBAR: OS_IOS ? 20 : 24,
	APPBAR_HEIGHT: 56,
	APPBAR_EXTENDED_HEIGHT: 128,
	TABS_HEIGHT: 48,
	TITLE_HEIGHT: 40,
	BOTTOMBAR_HEIGHT: 56,
	BUTTON_HEIGHT: 40,
	SNACKBAR_HEIGHT: 48
};

Alloy.Globals.Colors = {
	PRIMARY: '#5a6978',
	PRIMARY_DARK: '#303e4c',
	PRIMARY_LIGHT: '#8797a7',
	ACCENT: '#ffd416',
	TEXT_PRIMARY: '#ffffff',
	TEXT_SECONDARY: '#8affffff',
	TEXT_HINT: '#8affffff',
	TRANSPARENT: '#0FFF',
	BTN_SELECTED: '#FFCCBC',
	DIVIDER: '#1f000000',
	WINDOW_BACKGROUND: '#f9f9f9',
	CHIP_BACKGROUND: '#f2f2f2',
	CHIP_ICON_BACKGROUND: '#9C9C9C',
	
	BLACK_90: '#E6000000',
	BLACK_70: '#B3000000',
	BLACK_50: '#80000000',
	BLACK_30: '#4d000000',
	BLACK_10: '#1A000000',
	
	WHITE_10: '#1Affffff',
	WHITE_30: '#4Dffffff',
};

Alloy.Globals.Font = {
	DISPLAY: '34sp',
	HEADLINE: '25sp',
	TITLE: '21sp',
	SUBHEADING: '17sp',
	BODY: '15sp',
	CAPTION: '12sp',
	BUTTON: '14sp'
};

Alloy.Globals.Events = {
	ANDROID_BACK: 'event_android_back'
};

Alloy.Globals.Backstack = [];

Alloy.Collections.groups = Alloy.createCollection('HashtagGroup');
Alloy.Collections.groups.fetch();
Alloy.Collections.hashtags = Alloy.createCollection('Hashtag');
Alloy.Collections.hashtags.fetch();
