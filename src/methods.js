
export const messages = [
  'formatMessage',
  'messageFormatter',
]

export const formatterAliases = {
  formatCurrency: 'currencyFormatter',
	formatDate: 'dateFormatter',
	formatNumber: 'numberFormatter',
	formatRelativeTime: 'relativeTimeFormatter',
	formatUnit: 'unitFormatter',
	parseNumber: 'numberParser',
	parserDate: 'dateParser',
	plural: 'pluralGenerator'
}

export const formatters = [
  'currencyFormatter',
  'dateFormatter',
  'dateParser',
  'numberFormatter',
  'numberParser',
  'pluralGenerator',
  'relativeTimeFormatter',
  'unitFormatter',
  ...Object.keys(formatterAliases)
]
