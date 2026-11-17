/** Illustrative rates: units of currency per 1 USD */
export const currencies = [
  { code: 'USD', name: 'US Dollar', rate: 1 },
  { code: 'EUR', name: 'Euro', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', rate: 0.79 },
  { code: 'INR', name: 'Indian Rupee', rate: 83 },
  { code: 'CNY', name: 'Chinese Yuan', rate: 7.25 },
  { code: 'JPY', name: 'Japanese Yen', rate: 149 },
  { code: 'AUD', name: 'Australian Dollar', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'CHF', name: 'Swiss Franc', rate: 0.88 },
  { code: 'HKD', name: 'Hong Kong Dollar', rate: 7.82 },
  { code: 'SGD', name: 'Singapore Dollar', rate: 1.34 },
  { code: 'AED', name: 'UAE Dirham', rate: 3.67 },
  { code: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
  { code: 'QAR', name: 'Qatari Riyal', rate: 3.64 },
  { code: 'KWD', name: 'Kuwaiti Dinar', rate: 0.31 },
  { code: 'BHD', name: 'Bahraini Dinar', rate: 0.38 },
  { code: 'OMR', name: 'Omani Rial', rate: 0.38 },
  { code: 'NZD', name: 'New Zealand Dollar', rate: 1.66 },
  { code: 'SEK', name: 'Swedish Krona', rate: 10.5 },
  { code: 'NOK', name: 'Norwegian Krone', rate: 10.8 },
  { code: 'DKK', name: 'Danish Krone', rate: 6.9 },
  { code: 'PLN', name: 'Polish Zloty', rate: 4.0 },
  { code: 'CZK', name: 'Czech Koruna', rate: 23.2 },
  { code: 'HUF', name: 'Hungarian Forint', rate: 360 },
  { code: 'RON', name: 'Romanian Leu', rate: 4.6 },
  { code: 'TRY', name: 'Turkish Lira', rate: 32.5 },
  { code: 'RUB', name: 'Russian Ruble', rate: 92 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', rate: 41 },
  { code: 'ZAR', name: 'South African Rand', rate: 18.5 },
  { code: 'EGP', name: 'Egyptian Pound', rate: 48 },
  { code: 'NGN', name: 'Nigerian Naira', rate: 1550 },
  { code: 'KES', name: 'Kenyan Shilling', rate: 129 },
  { code: 'GHS', name: 'Ghanaian Cedi', rate: 15.5 },
  { code: 'MAD', name: 'Moroccan Dirham', rate: 10.0 },
  { code: 'TND', name: 'Tunisian Dinar', rate: 3.1 },
  { code: 'BRL', name: 'Brazilian Real', rate: 5.0 },
  { code: 'MXN', name: 'Mexican Peso', rate: 17.2 },
  { code: 'ARS', name: 'Argentine Peso', rate: 900 },
  { code: 'CLP', name: 'Chilean Peso', rate: 950 },
  { code: 'COP', name: 'Colombian Peso', rate: 4000 },
  { code: 'PEN', name: 'Peruvian Sol', rate: 3.75 },
  { code: 'KRW', name: 'South Korean Won', rate: 1330 },
  { code: 'TWD', name: 'New Taiwan Dollar', rate: 32 },
  { code: 'THB', name: 'Thai Baht', rate: 35.5 },
  { code: 'MYR', name: 'Malaysian Ringgit', rate: 4.7 },
  { code: 'IDR', name: 'Indonesian Rupiah', rate: 15800 },
  { code: 'PHP', name: 'Philippine Peso', rate: 56 },
  { code: 'VND', name: 'Vietnamese Dong', rate: 25400 },
  { code: 'PKR', name: 'Pakistani Rupee', rate: 278 },
  { code: 'BDT', name: 'Bangladeshi Taka', rate: 110 },
  { code: 'LKR', name: 'Sri Lankan Rupee', rate: 300 },
  { code: 'NPR', name: 'Nepalese Rupee', rate: 133 },
  { code: 'AFN', name: 'Afghan Afghani', rate: 70 },
  { code: 'ILS', name: 'Israeli Shekel', rate: 3.7 },
  { code: 'JOD', name: 'Jordanian Dinar', rate: 0.71 },
  { code: 'LBP', name: 'Lebanese Pound', rate: 89500 },
  { code: 'IQD', name: 'Iraqi Dinar', rate: 1310 },
  { code: 'IRR', name: 'Iranian Rial', rate: 42000 },
  { code: 'AZN', name: 'Azerbaijani Manat', rate: 1.7 },
  { code: 'GEL', name: 'Georgian Lari', rate: 2.7 },
  { code: 'KZT', name: 'Kazakhstani Tenge', rate: 450 },
  { code: 'UZS', name: 'Uzbekistani Som', rate: 12600 },
  { code: 'BYN', name: 'Belarusian Ruble', rate: 3.3 },
  { code: 'BGN', name: 'Bulgarian Lev', rate: 1.8 },
  { code: 'RSD', name: 'Serbian Dinar', rate: 108 },
  { code: 'HRK', name: 'Croatian Kuna', rate: 6.9 },
  { code: 'ISK', name: 'Icelandic Krona', rate: 138 },
  { code: 'XOF', name: 'West African CFA Franc', rate: 605 },
  { code: 'XAF', name: 'Central African CFA Franc', rate: 605 },
  { code: 'XCD', name: 'East Caribbean Dollar', rate: 2.7 },
  { code: 'JMD', name: 'Jamaican Dollar', rate: 155 },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', rate: 6.8 },
  { code: 'BBD', name: 'Barbadian Dollar', rate: 2.0 },
  { code: 'BSD', name: 'Bahamian Dollar', rate: 1.0 },
  { code: 'BZD', name: 'Belize Dollar', rate: 2.0 },
  { code: 'GTQ', name: 'Guatemalan Quetzal', rate: 7.8 },
  { code: 'HNL', name: 'Honduran Lempira', rate: 24.7 },
  { code: 'NIO', name: 'Nicaraguan Cordoba', rate: 36.7 },
  { code: 'CRC', name: 'Costa Rican Colon', rate: 520 },
  { code: 'PAB', name: 'Panamanian Balboa', rate: 1.0 },
  { code: 'DOP', name: 'Dominican Peso', rate: 59 },
  { code: 'CUP', name: 'Cuban Peso', rate: 24 },
  { code: 'UYU', name: 'Uruguayan Peso', rate: 39 },
  { code: 'PYG', name: 'Paraguayan Guarani', rate: 7300 },
  { code: 'BOB', name: 'Bolivian Boliviano', rate: 6.9 },
  { code: 'VES', name: 'Venezuelan Bolivar', rate: 36 },
  { code: 'GYD', name: 'Guyanese Dollar', rate: 209 },
  { code: 'SRD', name: 'Surinamese Dollar', rate: 35 },
  { code: 'FJD', name: 'Fijian Dollar', rate: 2.25 },
  { code: 'PGK', name: 'Papua New Guinean Kina', rate: 3.9 },
  { code: 'SBD', name: 'Solomon Islands Dollar', rate: 8.4 },
  { code: 'VUV', name: 'Vanuatu Vatu', rate: 119 },
  { code: 'WST', name: 'Samoan Tala', rate: 2.7 },
  { code: 'TOP', name: 'Tongan Paʻanga', rate: 2.35 },
  { code: 'MNT', name: 'Mongolian Tugrik', rate: 3400 },
  { code: 'KHR', name: 'Cambodian Riel', rate: 4100 },
  { code: 'LAK', name: 'Lao Kip', rate: 21500 },
  { code: 'MMK', name: 'Myanmar Kyat', rate: 2100 },
  { code: 'BND', name: 'Brunei Dollar', rate: 1.34 },
  { code: 'MOP', name: 'Macanese Pataca', rate: 8.05 },
  { code: 'MVR', name: 'Maldivian Rufiyaa', rate: 15.4 },
  { code: 'MUR', name: 'Mauritian Rupee', rate: 46 },
  { code: 'SCR', name: 'Seychellois Rupee', rate: 13.5 },
  { code: 'TZS', name: 'Tanzanian Shilling', rate: 2550 },
  { code: 'UGX', name: 'Ugandan Shilling', rate: 3750 },
  { code: 'RWF', name: 'Rwandan Franc', rate: 1300 },
  { code: 'ETB', name: 'Ethiopian Birr', rate: 57 },
  { code: 'DZD', name: 'Algerian Dinar', rate: 134 },
  { code: 'LYD', name: 'Libyan Dinar', rate: 4.8 },
  { code: 'SDG', name: 'Sudanese Pound', rate: 600 },
  { code: 'SOS', name: 'Somali Shilling', rate: 570 },
  { code: 'DJF', name: 'Djiboutian Franc', rate: 178 },
  { code: 'ERN', name: 'Eritrean Nakfa', rate: 15 },
  { code: 'MWK', name: 'Malawian Kwacha', rate: 1730 },
  { code: 'ZMW', name: 'Zambian Kwacha', rate: 26 },
  { code: 'BWP', name: 'Botswana Pula', rate: 13.5 },
  { code: 'NAD', name: 'Namibian Dollar', rate: 18.5 },
  { code: 'SZL', name: 'Swazi Lilangeni', rate: 18.5 },
  { code: 'LSL', name: 'Lesotho Loti', rate: 18.5 },
  { code: 'MZN', name: 'Mozambican Metical', rate: 64 },
  { code: 'AOA', name: 'Angolan Kwanza', rate: 850 },
  { code: 'CDF', name: 'Congolese Franc', rate: 2800 },
  { code: 'GMD', name: 'Gambian Dalasi', rate: 68 },
  { code: 'GNF', name: 'Guinean Franc', rate: 8600 },
  { code: 'SLL', name: 'Sierra Leonean Leone', rate: 22500 },
  { code: 'LRD', name: 'Liberian Dollar', rate: 190 },
  { code: 'CVE', name: 'Cape Verdean Escudo', rate: 101 },
  { code: 'STN', name: 'São Tomé Dobra', rate: 22.5 },
  { code: 'MGA', name: 'Malagasy Ariary', rate: 4500 },
  { code: 'KMF', name: 'Comorian Franc', rate: 450 },
  { code: 'ALL', name: 'Albanian Lek', rate: 95 },
  { code: 'MKD', name: 'Macedonian Denar', rate: 56.5 },
  { code: 'BAM', name: 'Bosnia-Herzegovina Mark', rate: 1.8 },
  { code: 'MDL', name: 'Moldovan Leu', rate: 17.8 },
  { code: 'AMD', name: 'Armenian Dram', rate: 390 },
  { code: 'KGS', name: 'Kyrgyzstani Som', rate: 89 },
  { code: 'TJS', name: 'Tajikistani Somoni', rate: 10.9 },
  { code: 'TMT', name: 'Turkmenistani Manat', rate: 3.5 },
  { code: 'BTN', name: 'Bhutanese Ngultrum', rate: 83 },
  { code: 'MVR', name: 'Maldivian Rufiyaa', rate: 15.4 },
].filter((c, i, arr) => arr.findIndex((x) => x.code === c.code) === i)
  .sort((a, b) => a.code.localeCompare(b.code))

export const currencyByCode = Object.fromEntries(currencies.map((c) => [c.code, c]))

export function formatMoney(code, value) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(Math.round(value))
  } catch {
    return `${code} ${Math.round(value).toLocaleString()}`
  }
}

export function formatNumber(code, value) {
  const locale = code === 'INR' ? 'en-IN' : undefined
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))
}

export function convert(amount, fromCode, toCode) {
  const from = currencyByCode[fromCode]
  const to = currencyByCode[toCode]
  if (!from || !to) return amount
  const usd = amount / from.rate
  return usd * to.rate
}

export function currencySymbol(code) {
  try {
    const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol' })
      .formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value || code
  } catch {
    return code
  }
}
