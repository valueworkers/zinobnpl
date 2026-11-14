const items = [
  ['Know your limit', 'Approved upfront', 'Get an approved trade credit line before you order, so you know exactly what you can buy.'],
  ['Zero collateral', 'No security', 'No property security and no personal guarantee. Just a verified account and the terms.'],
  ['Grow at your pace', 'Start small, scale up', 'Begin with smaller orders to build confidence, then grow your volume as your business does.'],
]

export default function Why() {
  return (
    <div className="band">
      <section className="wrap">
        <div className="head">
          <p className="eyebrow">Why ZinoBNPL</p>
          <h2>Trade credit terms, without the bank.</h2>
          <p>An approved line you can use across every verified supplier, with none of the security a bank would ask for.</p>
        </div>
        <div className="why" style={{ '--bg': 'var(--band)' }}>
          {items.map(([tag, title, text]) => (
            <div key={title} style={{ background: 'var(--band-line)' }}>
              <span className="tag">{tag}</span>
              <h3>{title}</h3>
              <p style={{ color: 'var(--band-muted)' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
