import { useState } from 'react'

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
const money = (n) => '₹' + inr.format(Math.round(n))
const num = (s) => {
  const v = parseFloat(String(s).replace(/,/g, ''))
  return isNaN(v) || v < 0 ? 0 : v
}

const chips = [
  [500000, '₹5 lakh'],
  [1000000, '₹10 lakh'],
  [2500000, '₹25 lakh'],
  [10000000, '₹1 crore'],
]

export default function Calculator() {
  const [amount, setAmount] = useState('10,00,000')
  const [basis, setBasis] = useState('cif')
  const [fee, setFee] = useState('4.5')
  const [freight, setFreight] = useState('8')
  const [days, setDays] = useState('60')

  const cif = basis === 'cif'
  const g = num(amount)
  const fr = cif ? (g * num(freight)) / 100 : 0
  const fv = (g * num(fee)) / 100
  const total = g + fr + fv
  const d = Math.round(num(days))

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
              <label htmlFor="amount">Goods value (INR)</label>
              <div className="input">
                <span>₹</span>
                <input
                  id="amount"
                  inputMode="numeric"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={() => setAmount(inr.format(num(amount)))}
                />
              </div>
              <div className="chips">
                {chips.map(([v, label]) => (
                  <button key={v} type="button" className="chip" onClick={() => setAmount(inr.format(v))}>{label}</button>
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
                <div className="input small"><input id="fee" inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} /><em>%</em></div>
              </div>
              <div className="field">
                <label htmlFor="freight">Freight + insurance</label>
                <div className="input small"><input id="freight" inputMode="decimal" value={freight} onChange={(e) => setFreight(e.target.value)} /><em>%</em></div>
              </div>
              <div className="field">
                <label htmlFor="days">Balance due</label>
                <div className="input small"><input id="days" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} /><em>days</em></div>
              </div>
            </div>
            <p className="note">Service fee, freight and balance days are illustrative placeholders. Your approved terms and quotation set the real figures.</p>
          </form>

          <div className="result" aria-live="polite">
            <dl>
              <div className="row"><dt>Goods value</dt><dd>{money(g)}</dd></div>
              <div className="row" hidden={!cif}><dt>Freight + insurance (indicative)</dt><dd>{money(fr)}</dd></div>
              <div className="row"><dt>Service fee</dt><dd>{money(fv)}</dd></div>
              <div className="row total"><dt>Order total</dt><dd>{money(total)}</dd></div>
            </dl>
            <div className="pay">
              <div className="now"><small>Deposit today (20%)</small><strong>{money(total * 0.2)}</strong><em>Due to confirm the order</em></div>
              <div className="later"><small>Balance later (80%)</small><strong>{money(total * 0.8)}</strong><em>Within {d} day{d === 1 ? '' : 's'} of port arrival</em></div>
            </div>
            <p className="note">Estimate only, not a quote. Customs duty, IGST and port clearance charges are paid separately at import and are not included here. Final figures are confirmed when you place an order, subject to approval.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
