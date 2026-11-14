const rows = [
  ['Cash needed at order', 'Often a large share, sometimes all of it', 'Margin money, plus bank charges', '20% deposit'],
  ['Security', 'None, but your cash is exposed', 'Collateral or a personal guarantee is common', 'No security, no guarantee'],
  ['Knowing your limit', 'Limited by your own cash', 'Sanction limits set by the bank', 'Approved line shown before you order'],
  ['Suppliers', 'Vetting is up to you', 'You find and vet them', 'One account across verified suppliers'],
]

export default function Compare() {
  return (
    <section className="wrap" id="compare">
      <div className="head">
        <p className="eyebrow">How we compare</p>
        <h2>Three ways to fund a China order.</h2>
        <p>A general comparison of how importers usually pay for goods. Your own terms will vary.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th></th><th>Advance payment</th><th>Bank trade finance</th><th className="us">ZinoBNPL</th></tr>
          </thead>
          <tbody>
            {rows.map(([label, adv, bank, us]) => (
              <tr key={label}><td>{label}</td><td>{adv}</td><td>{bank}</td><td className="us">{us}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
