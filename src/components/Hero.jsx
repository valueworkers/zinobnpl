const route = [
  ['Credit approved', 'Apply once, see your limit first'],
  ['20% deposit', 'Production starts'],
  ['Goods ship to your destination', 'Insured and freighted, subject to route availability'],
  ['Settle the balance', 'Later, on the terms you were approved for'],
]

export default function Hero() {
  return (
    <div className="wrap hero">
      <div>
        <p className="eyebrow">Trade credit for genuine businesses, worldwide</p>
        <h1 style={{ marginTop: '1rem' }}>Buy wholesale from China. <mark>Pay later.</mark></h1>
        <p className="lede">Get an approved trade credit line upfront, then pay just a <strong>20% deposit</strong> to start receiving your supplies. No security, no guarantee, no bank.</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#apply">Open an account</a>
          <a className="btn btn-ghost" href="#how">See how it works</a>
        </div>
        <div className="proof">
          <span>Approved before you order</span>
          <span>One account, every supplier</span>
          <span>Built for registered, verifiable businesses</span>
        </div>
      </div>

      <aside className="route" aria-label="How an order is paid">
        <p className="eyebrow">Your order, split in two</p>
        <div className="route-cities"><span>China</span><span>Your Country</span></div>
        <div className="route-line" aria-hidden="true"></div>
        <div className="split"><div className="d">20% now</div><div className="b">80% later</div></div>
        <div className="split-cap"><span>Deposit confirms the order</span><span>Balance on approved terms</span></div>
        <ol>
          {route.map(([title, sub], i) => (
            <li key={title}><b>{i + 1}</b><div><strong>{title}</strong><span>{sub}</span></div></li>
          ))}
        </ol>
      </aside>
    </div>
  )
}
