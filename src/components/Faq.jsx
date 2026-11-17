const faqs = [
  ['Who can apply?', 'Registered businesses importing for trade or production—including MSMEs, traders, manufacturers and retailers—may apply. In India, applicants need a valid GSTIN, business PAN and Importer-Exporter Code (IEC). Applicants in other countries need equivalent local business, tax and import/export registrations. Eligibility depends on service availability and account approval.'],
  ['Do I need to give security or a guarantee?', 'No. There is no property security and no personal guarantee. Your approval rests on your business details and the account you open.'],
  ['How is my credit line decided?', 'We assess your business and confirm an approved amount and term in writing before you place any order, so you know what you can buy.'],
  ['What does it cost?', 'The service fee and any freight and insurance are shown on your quotation before you pay anything. The calculator above uses placeholder rates so you can plan, not a quote.'],
  ['When do I pay the balance?', 'After your deposit, the balance settles later on the terms you were approved for. The calculator shows the balance due date as a number of days you can edit.'],
  ['Are customs duty and GST included?', 'No. Basic customs duty, IGST and port or clearing charges are payable at import. Your customs broker can estimate them for your HS code.'],
  ['Which Indian ports can I ship to?', 'Goods are shipped to an Indian port such as Nhava Sheva (JNPT), Mundra, Chennai, Kolkata or Tuticorin. Inland destinations are cleared at the nearest port.'],
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
