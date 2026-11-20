const isValidAbn = (value) => {
  if (!/^\d{11}$/.test(value)) return false

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  const weightedSum = [...value].reduce((sum, digit, index) => {
    const number = Number(digit) - (index === 0 ? 1 : 0)
    return sum + number * weights[index]
  }, 0)

  return weightedSum % 89 === 0
}

const isValidUscc = (value) => {
  const characters = '0123456789ABCDEFGHJKLMNPQRTUWXY'
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]
  if (value.length !== 18 || [...value].some((character) => !characters.includes(character))) return false

  const weightedSum = [...value.slice(0, 17)].reduce(
    (sum, character, index) => sum + characters.indexOf(character) * weights[index],
    0,
  )

  return value[17] === characters[(31 - (weightedSum % 31)) % 31]
}

const countryCodesByName = {
  australia: 'AU',
  china: 'CN',
  india: 'IN',
  singapore: 'SG',
}

export const registrationCountryCode = (name) => countryCodesByName[name.trim().toLowerCase()]

export const registrationRules = {
  IN: {
    label: 'GST Registration Number (GSTIN)',
    placeholder: 'Enter 15-character GSTIN',
    error: 'Enter a GSTIN in the valid 15-character format.',
    validate: (value) => /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[A-Z0-9]$/.test(value),
  },
  AU: {
    label: 'Australian Business Number (ABN)',
    placeholder: 'Enter 11-digit ABN',
    error: 'Enter a valid 11-digit ABN, including its check digit.',
    validate: isValidAbn,
  },
  SG: {
    label: 'GST Registration Number / UEN',
    placeholder: 'Enter 9- or 10-character UEN',
    error: 'Enter a 9- or 10-character GST registration number / UEN.',
    validate: (value) => /^[A-Z0-9]{9,10}$/.test(value),
  },
  CN: {
    label: 'Unified Social Credit Code (USCC)',
    placeholder: 'Enter 18-character USCC',
    error: 'Enter a valid 18-character Unified Social Credit Code.',
    validate: isValidUscc,
  },
}
