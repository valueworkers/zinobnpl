const cats = [
  'Electronics & components', 'LED & electricals', 'Hardware & tools', 'Machinery & spare parts', 'Auto parts',
  'Packaging materials', 'Textiles & trims', 'Home & kitchenware', 'Stationery & gifting', 'Plastics & moulded parts',
]

export default function Categories() {
  return (
    <section className="wrap" style={{ paddingTop: 0 }}>
      <div className="head">
        <p className="eyebrow">What you can buy</p>
        <h2>Stock the shelf, the shop floor and the workshop.</h2>
      </div>
      <div className="cats">
        {cats.map((c) => <span key={c}>{c}</span>)}
      </div>
      <p className="cats-note">Some goods require product certifications, permits or import licences to clear customs. Requirements vary by product and destination country, so check the rules before you order.</p>
    </section>
  )
}
