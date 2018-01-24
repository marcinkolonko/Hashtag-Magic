exports.setLocale = function(locale)
{
	locale = locale || 'de-CH';
	
	Ti.App.Properties.setString('current_language', locale);
	var language = locale.substring(0,2);
	
	console.log('*** new locale: ' + locale + ' current: ' + Ti.Locale.getCurrentLanguage());
	if(language !== Ti.Locale.getCurrentLanguage())
	{
		Moment.locale(locale);
		Ti.Locale.setLanguage(language);
		console.log('*** new language: ' + Ti.Locale.getCurrentLanguage() + ', locale: ' + Ti.App.Properties.getString('current_language'));
		Dispatcher.trigger(Events.LOCALE_CHANGED);
	}
};
