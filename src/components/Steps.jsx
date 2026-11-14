const steps = [
  ['Apply', 'Share your business details and the credit you need. One application covers every supplier.'],
  ['Get approved', 'We assess your business and come back with an approved credit amount and term. Timing can vary with demand.'],
  ['Order and pay 20%', 'Choose goods or request a quote, accept the final quotation and pay the 20% deposit. Production starts and your goods ship.'],
  ['Settle later', 'Pay the balance later on your approved terms. No bank, no security, no guarantee.'],
]

export default function Steps() {
  return (
    <section className="wrap" id="how">
      <div className="head">
        <p className="eyebrow">From application to delivery</p>
        <h2>Approved first. Then you order.</h2>
        <p>You know your credit line before you commit to anything, and there is no security to arrange.</p>
      </div>
      <ol className="steps">
        {steps.map(([title, text]) => (
          <li key={title}><h3>{title}</h3><p>{text}</p></li>
        ))}
      </ol>
    </section>
  )
}
