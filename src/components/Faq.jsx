const faqs = [
  ['Who can apply?', 'Legally registered businesses importing for trade or production—including small and medium-sized businesses, traders, manufacturers and retailers—may apply. Applicants need valid business, tax and import/export registrations for their country. Eligibility depends on service availability and account approval.'],
  ['Do I need to give security or a guarantee?', 'No. There is no property security and no personal guarantee. Your approval rests on your business details and the account you open.'],
  ['How is my credit line decided?', 'We assess your business and confirm an approved amount and term in writing before you place any order, so you know what you can buy.'],
  ['What does it cost?', 'The service fee and any freight and insurance are shown on your quotation before you pay anything. The calculator above uses placeholder rates so you can plan, not a quote.'],
  ['When do I pay the balance?', 'After your deposit, the balance settles later on the terms you were approved for. The calculator shows the balance due date as a number of days you can edit.'],
  ['Are customs duties and import taxes included?', 'No. Customs duties, import taxes and port or clearance charges are payable separately. These vary by product and destination. Check the applicable costs with your customs broker using the product’s HS code.'],
  ['Where can I ship to?', 'Shipping destinations depend on service availability and the route for your order. Confirm the destination port and any inland delivery arrangements before placing an order.'],
]

export default function Faq() {
  return (
    <section className="wrap" id="faq">
      <div className="head">
        <p className="eyebrow">Questions</p>
        <h2>Before you apply.</h2>
      </div>
      <div className="faq">
        {faqs.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    </section>
  )
}
