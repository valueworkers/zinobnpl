import { useMemo, useState } from 'react'
import {
  currencies,
  currencyByCode,
  currencySymbol,
  convert,
  formatMoney,
  formatNumber,
} from '../data/currencies'

const DEFAULT = 'USD'
const DEFAULT_AMOUNT = 12000

const chipPresets = {
  USD: [
    [5000, '$5k'],
    [10000, '$10k'],
    [25000, '$25k'],
    [100000, '$100k'],
  ],
  INR: [
    [500000, '₹500,000'],
    [1000000, '₹1,000,000'],
    [2500000, '₹2,500,000'],
    [10000000, '₹10,000,000'],
  ],
}

function defaultChips(code) {
  if (chipPresets[code]) return chipPresets[code]
  const base = [5000, 10000, 25000, 100000].map((usd) => Math.round(convert(usd, 'USD', code)))
  const sym = currencySymbol(code)
  return base.map((v) => [v, `${sym}${formatNumber(code, v)}`])
}

const num = (s) => {
  const v = parseFloat(String(s).replace(/,/g, ''))
  return isNaN(v) || v < 0 ? 0 : v
}

export default function Calculator() {
  const [currency, setCurrency] = useState(DEFAULT)
  const [amount, setAmount] = useState(formatNumber(DEFAULT, DEFAULT_AMOUNT))
  const [basis, setBasis] = useState('cif')
  const [fee, setFee] = useState('4.5')
  const [freight, setFreight] = useState('8')
  const [days, setDays] = useState('60')

  const symbol = useMemo(() => currencySymbol(currency), [currency])
  const chips = useMemo(() => defaultChips(currency), [currency])
  const rate = currencyByCode[currency]?.rate ?? 1
  const cif = basis === 'cif'
  const maxDays = cif ? 60 : 90
  const feeNumber = Number(fee)
  const daysNumber = Number(days)
  const feeError = fee.trim() === '' || !Number.isFinite(feeNumber) || feeNumber < 3
    ? 'Service fee must be at least 3%.'
    : ''
  const daysError = days.trim() === '' || !Number.isInteger(daysNumber) || daysNumber < 0
    ? 'Enter a whole number of days.'
    : daysNumber > maxDays
      ? `Maximum ${maxDays} days for ${cif ? 'CIF' : 'Ex Works'}.`
      : ''
  const inputsValid = !feeError && !daysError

  const switchCurrency = (next) => {
    if (next === currency) return
    const converted = convert(num(amount), currency, next)
    setCurrency(next)
    setAmount(formatNumber(next, converted))
  }

  const g = num(amount)
  const fr = cif ? (g * num(freight)) / 100 : 0
  const fv = (g * num(fee)) / 100
  const total = g + fr + fv
  const d = Math.round(num(days))
  const money = (n) => formatMoney(currency, n)

  return (
    <div className="band" id="calculator">
      <section className="wrap">
        <div className="head">
          <p className="eyebrow">Run your numbers</p>
          <h2>See what an order looks like.</h2>
          <p>Enter an order value to see the deposit due today and the balance that settles later. The assumptions are editable, so you can match them to your quotation.</p>
        </div>
        <div className="calc">
          <form className="panel" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <label htmlFor="currency">Choose your currency</label>
              <select
                id="currency"
                className="currency-select"
                value={currency}
                onChange={(e) => switchCurrency(e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="amount">Order value ({currency})</label>
              <div className="input">
                <span>{symbol}</span>
                <input
                  id="amount"
                  inputMode="numeric"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={() => setAmount(formatNumber(currency, num(amount)))}
                />
              </div>
              <div className="chips">
                {chips.map(([v, label]) => (
                  <button key={v} type="button" className="chip" onClick={() => setAmount(formatNumber(currency, v))}>{label}</button>
                ))}
              </div>
            </div>
            <fieldset>
              <legend style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: '.4rem' }}>Shipping basis</legend>
              <div className="seg">
                <label>
                  <input type="radio" name="basis" value="cif" checked={cif} onChange={() => setBasis('cif')} />
                  <span>CIF<small>Freight + insurance included</small></span>
                </label>
                <label>
                  <input type="radio" name="basis" value="exw" checked={!cif} onChange={() => setBasis('exw')} />
                  <span>Ex Works<small>You arrange freight</small></span>
                </label>
              </div>
            </fieldset>
            <div className="assume">
              <div className="field">
                <label htmlFor="fee">Service fee</label>
                <div className={`input small${feeError ? ' invalid' : ''}`}>
                  <input
                    id="fee"
                    type="number"
                    min="3"
                    step="any"
                    inputMode="decimal"
                    value={fee}
                    aria-invalid={Boolean(feeError)}
                    aria-describedby={feeError ? 'fee-error' : undefined}
                    onChange={(e) => setFee(e.target.value)}
                  />
                  <em>%</em>
                </div>
                {feeError && <p className="field-error" id="fee-error">{feeError}</p>}
              </div>
              <div className="field">
                <label htmlFor="freight">Freight + insurance</label>
                <div className="input small">
                  <input
                    id="freight"
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={freight}
                    onChange={(e) => setFreight(e.target.value)}
                  />
                  <em>%</em>
                </div>
              </div>
              <div className="field">
                <label htmlFor="days">Balance due</label>
                <div className={`input small${daysError ? ' invalid' : ''}`}>
                  <input
                    id="days"
                    type="number"
                    min="0"
                    max={maxDays}
                    step="1"
                    inputMode="numeric"
                    value={days}
                    aria-invalid={Boolean(daysError)}
                    aria-describedby={daysError ? 'days-error' : undefined}
                    onChange={(e) => setDays(e.target.value)}
                  />
                  <em>days</em>
                </div>
                {daysError && <p className="field-error" id="days-error">{daysError}</p>}
              </div>
            </div>
            <p className="note">
              Currency conversion uses illustrative rates (1 USD ≈ {rate === 1 ? '1 USD' : `${formatNumber(currency, rate)} ${currency}`}).
              Service fee, freight and balance days are placeholders. Your approved terms and quotation set the real figures.
            </p>
          </form>

          <div className="result" aria-live="polite">
            {inputsValid ? (
              <>
                <dl>
                  <div className="row"><dt>Order value</dt><dd>{money(g)}</dd></div>
                  {cif && <div className="row"><dt>Freight + insurance (indicative)</dt><dd>{money(fr)}</dd></div>}
                  <div className="row"><dt>Service fee</dt><dd>{money(fv)}</dd></div>
                  <div className="row total"><dt>Order total</dt><dd>{money(total)}</dd></div>
                </dl>
                <div className="pay">
                  <div className="now"><small>Deposit today (20%)</small><strong>{money(total * 0.2)}</strong><em>Due to confirm the order</em></div>
                  <div className="later"><small>Balance later (80%)</small><strong>{money(total * 0.8)}</strong><em>Within {d} day{d === 1 ? '' : 's'} of port arrival</em></div>
                </div>
              </>
            ) : (
              <p className="validation-summary" role="status">Enter a service fee of at least 3% and valid balance days to see the estimate.</p>
            )}
            <p className="note">Estimate only, not a quote. Customs duties, import taxes and port or clearance charges are paid separately and are not included here. Final figures are confirmed when you place an order, subject to approval.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
