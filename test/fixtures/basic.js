var like;
var Globalize = require('globalize');

// Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
Globalize.load(
	require('cldr-data/main/en/ca-gregorian'),
	require('cldr-data/main/en/currencies'),
	require('cldr-data/main/en/dateFields'),
	require('cldr-data/main/en/numbers'),
	require('cldr-data/supplemental/currencyData'),
	require('cldr-data/supplemental/likelySubtags'),
	require('cldr-data/supplemental/plurals'),
	require('cldr-data/supplemental/timeData'),
	require('cldr-data/supplemental/weekData')
);
Globalize.loadMessages(require('./messages/en'));

Globalize.locale('en');

Globalize.formatDate(new Date(), { datetime: 'medium' });
Globalize.formatNumber(12345.6789);
Globalize.formatCurrency(69900, 'USD');
Globalize.plural(12345.6789);

Globalize.dateFormatter({ datetime: 'medium' });
Globalize.currenyFormatter('USD');

// Use Globalize to format a message with plural inflection.
like = Globalize.messageFormatter('like');
like(0);
like(1);
like(2);
like(3);

// Use Globalize to format relative time.
Globalize.formatRelativeTime(-35, 'second');
