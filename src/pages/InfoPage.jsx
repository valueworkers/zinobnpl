import { useEffect, useState } from 'react'
import { submitForm } from '../lib/submitForm'

const contactEmail = 'support@zinobnpl.com'

export const infoPages = {
  '/privacy-policy': {
    eyebrow: 'Your information',
    title: 'Privacy Policy',
    intro: 'We respect your privacy and handle personal and business information with care. This policy explains what information ZinoBNPL may collect and how it is used when you visit our website or use our services.',
    sections: [
      {
        heading: 'Information we collect',
        paragraphs: [
          'Depending on how you use our services, we may collect contact and business details, account and verification information, order and payment records, and messages you send to us.',
          'We may also collect basic technical information such as browser type, device information, and website usage data to help operate and improve the site.',
        ],
      },
      {
        heading: 'How we use information',
        paragraphs: [
          'We use information to respond to enquiries, provide and administer accounts, assess applications, support transactions with suppliers, keep records, protect our services, and meet legal or regulatory requirements.',
        ],
      },
      {
        heading: 'When information is shared',
        paragraphs: [
          'We may share relevant information with suppliers involved in your enquiry or order, with service providers who help operate our services, or when disclosure is required by law or needed to protect our rights and users.',
          'We do not disclose more information than is reasonably needed for the relevant purpose.',
        ],
      },
      {
        heading: 'Retention and your choices',
        paragraphs: [
          'We keep information for as long as needed for the purposes described above, including record-keeping and legal obligations. You may contact us to ask about or request access to information associated with you, subject to applicable law.',
        ],
      },
      {
        heading: 'Updates and questions',
        paragraphs: [
          'We may update this policy as our services or legal requirements change. For privacy questions or requests, please contact us using the details on our Contact us page.',
        ],
      },
    ],
  },
  '/terms-and-conditions': {
    eyebrow: 'Using our services',
    title: 'Terms & Conditions',
    intro: 'These terms describe the general conditions for using the ZinoBNPL website and services. Additional terms may apply to an account, credit facility, quotation, or individual order.',
    sections: [
      {
        heading: 'Eligibility and account information',
        paragraphs: [
          'Our services are intended for business use. You agree to provide complete and accurate information and to keep your account details current. Access to accounts or credit facilities may be subject to verification and approval.',
        ],
      },
      {
        heading: 'Orders and suppliers',
        paragraphs: [
          'Supplier products, availability, pricing, production, and delivery are subject to confirmation for each order. Your order documents and the supplier’s terms govern the specific transaction.',
          'You are responsible for reviewing product details, quantities, delivery information, and any applicable import requirements before confirming an order.',
        ],
      },
      {
        heading: 'Credit, fees, and payment',
        paragraphs: [
          'Any credit is subject to approval and the terms provided for your account or transaction. Illustrations and estimates on this website are for general information and are not an offer of credit or a binding quotation.',
          'Applicable deposits, fees, payment dates, and repayment obligations will be set out in the relevant approved terms or order documents.',
        ],
      },
      {
        heading: 'Acceptable use and service changes',
        paragraphs: [
          'You must use the website lawfully and must not interfere with its operation or access it in a way that could harm the service or other users. We may update or discontinue website features and revise these terms from time to time.',
        ],
      },
      {
        heading: 'Applicable terms',
        paragraphs: [
          'Nothing on this page limits rights or protections that cannot be limited under applicable law. Where an account agreement or order document sets out specific terms, those terms apply to that account or order.',
        ],
      },
    ],
  },
  '/shipping-policy': {
    eyebrow: 'Order delivery',
    title: 'Shipping Policy',
    intro: 'Shipping arrangements are confirmed for each order. Delivery options and timing can vary based on the supplier, products, destination, and shipping method.',
    sections: [
      {
        heading: 'Delivery estimates',
        paragraphs: [
          'Any production or delivery dates provided before an order is confirmed are estimates. The supplier or shipping provider will confirm the applicable schedule, and delays may occur due to production, transport, customs, weather, or other circumstances outside our control.',
        ],
      },
      {
        heading: 'Shipping charges and import requirements',
        paragraphs: [
          'Shipping, insurance, duties, taxes, and other import or delivery charges will be described in the quotation or order documents where applicable. Unless the order documents say otherwise, buyers are responsible for understanding and meeting the import, customs, and regulatory requirements that apply to their goods.',
        ],
      },
      {
        heading: 'Receiving an order',
        paragraphs: [
          'Please arrange for an authorized person to receive the shipment and check the goods promptly on arrival. If goods appear damaged, short, or incorrect, document the issue and contact us and the supplier as soon as possible using the details on your order documents.',
        ],
      },
      {
        heading: 'Order-specific arrangements',
        paragraphs: [
          'The shipping terms agreed for an individual order take precedence over this general policy where they differ.',
        ],
      },
    ],
  },
  '/refund-policy': {
    eyebrow: 'Cancellations and refunds',
    title: 'Refund Policy',
    intro: 'Refund and cancellation eligibility depends on the supplier, the nature and status of the order, and the terms agreed for that transaction.',
    sections: [
      {
        heading: 'Before requesting a refund',
        paragraphs: [
          'Review the cancellation, return, and refund terms in your quotation, order confirmation, and supplier agreement. Custom-made, made-to-order, or already shipped goods may have different options from standard items.',
        ],
      },
      {
        heading: 'How to raise a request',
        paragraphs: [
          'Contact us and the supplier promptly if you need to cancel an order or report goods that are damaged, missing, or not as described. Include your order reference, the reason for the request, and supporting details such as photographs where relevant.',
        ],
      },
      {
        heading: 'Review and processing',
        paragraphs: [
          'Requests are reviewed against the applicable order terms and the facts of the case. If a refund is approved, the amount and method will be confirmed with you. Processing times may depend on the supplier and payment provider.',
        ],
      },
      {
        heading: 'Credit and payment obligations',
        paragraphs: [
          'A cancellation or refund request does not automatically change payment obligations under an approved credit or account agreement. Please contact us if an order issue may affect a scheduled payment so it can be reviewed under your applicable terms.',
        ],
      },
    ],
  },
  '/about-us': {
    eyebrow: 'About ZinoBNPL',
    title: 'Wholesale purchasing, made clearer.',
    intro: 'ZinoBNPL helps businesses worldwide explore wholesale suppliers and manage purchases with trade-credit options, subject to service availability and approval.',
    sections: [
      {
        heading: 'A simpler way to source',
        paragraphs: [
          'We bring supplier discovery and order support together to help business buyers navigate sourcing. Buyers can review supplier information, discuss order requirements, and understand the payment terms available to them.',
        ],
      },
      {
        heading: 'Built around business needs',
        paragraphs: [
          'Every business and order is different. Supplier arrangements, delivery, and any approved credit terms are confirmed for each transaction so buyers can make informed decisions.',
        ],
      },
      {
        heading: 'Our approach',
        paragraphs: [
          'We aim to make the wholesale buying process straightforward, transparent, and helpful. Credit is subject to approval, and product, supplier, and import details should be confirmed before placing an order.',
        ],
      },
    ],
  },
  '/contact-us': {
    eyebrow: 'We’re here to help',
    title: 'Contact us',
    intro: 'Questions about an account, supplier, or order? Get in touch and include any relevant account or order reference so we can direct your enquiry.',
    email: contactEmail,
    sections: [
      {
        heading: 'Supplier enquiries',
        paragraphs: [
          'Suppliers interested in working with ZinoBNPL can contact us with a brief introduction to their company, products, and export experience.',
        ],
      },
      {
        heading: 'Order or account support',
        paragraphs: [
          'For help with an existing order or account, please include the business name and order reference where available. Do not send passwords or sensitive payment details by email.',
        ],
      },
    ],
  },
}

function InfoSection({ section }) {
  return (
    <section className="info-section">
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
  )
}

function ContactPage({ page }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    enquiry: 'Supplier onboarding',
    message: '',
  })
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setStatus('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)
    setStatus('')
    try {
      await submitForm('contact', form)
      setStatus('Your enquiry has been submitted. Our team will be in touch.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main id="top" className="contact-page">
      <div className="wrap">
        <section className="contact-hero">
          <div className="contact-hero-copy">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>Let’s start a conversation.</h1>
            <p>{page.intro}</p>
          </div>
        </section>

        <div className="contact-layout">
          <aside className="contact-aside">
            <p className="eyebrow">Supplier & buyer support</p>
            <h2>Let’s build better partnerships.</h2>
            <p className="contact-aside-lede">
              Whether you’re a supplier in China or a business buyer, we’re here to help.
            </p>

            <div className="contact-options">
              <div className="contact-option contact-option-supplier">
                <span>01</span>
                <div>
                  <p className="contact-option-label">For suppliers</p>
                  <h3>Join our approved network</h3>
                  <p>Get help with onboarding, verification, and product listings.</p>
                </div>
              </div>
              <div className="contact-option">
                <span>02</span>
                <div>
                  <p className="contact-option-label">For buyers</p>
                  <h3>Get support with your business</h3>
                  <p>Talk to us about accounts, sourcing, credit, or orders.</p>
                </div>
              </div>
            </div>

            <a className="contact-direct-email" href={`mailto:${contactEmail}`}>
              <span>Prefer email? Contact us directly</span>
              <strong>{contactEmail}</strong>
            </a>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-heading">
              <p className="eyebrow">Send an enquiry</p>
              <h2>How can we help?</h2>
            </div>

            <div className="contact-fields">
              <div className="contact-field">
                <label htmlFor="contact-name">Full name <span>*</span></label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={updateField}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email address <span>*</span></label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                  value={form.email}
                  onChange={updateField}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  autoComplete="organization"
                  placeholder="Company name"
                  value={form.company}
                  onChange={updateField}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-phone">Phone / WhatsApp</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Include country code"
                  value={form.phone}
                  onChange={updateField}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-country">Country</label>
                <input
                  id="contact-country"
                  name="country"
                  autoComplete="country-name"
                  placeholder="Where are you based?"
                  value={form.country}
                  onChange={updateField}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-enquiry">I’m contacting you about <span>*</span></label>
                <select
                  id="contact-enquiry"
                  name="enquiry"
                  required
                  value={form.enquiry}
                  onChange={updateField}
                >
                  <option>Supplier onboarding</option>
                  <option>Supplier partnership</option>
                  <option>Buyer account</option>
                  <option>Existing order or account</option>
                  <option>General enquiry</option>
                </select>
              </div>
              <div className="contact-field contact-field-full">
                <label htmlFor="contact-message">Message <span>*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="6"
                  placeholder="Tell us about your business, products, or question..."
                  required
                  value={form.message}
                  onChange={updateField}
                />
              </div>
            </div>

            <div className="contact-form-footer">
              <p>
                By continuing, you agree that ZinoBNPL may use these details to respond to your enquiry.
              </p>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : <>Send enquiry <span aria-hidden="true">→</span></>}
              </button>
            </div>
            <p className="contact-status" role="status" hidden={!status}>{status}</p>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function InfoPage({ page }) {
  useEffect(() => {
    document.title = `${page.title} | ZinoBNPL`
  }, [page.title])

  if (page.email === contactEmail) {
    return <ContactPage page={page} />
  }

  return (
    <main id="top" className={page === infoPages['/about-us'] ? 'info-page about-page' : 'info-page'}>
      <div className="wrap">
        <section className="info-hero">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="info-intro">{page.intro}</p>
          {page.email && (
            <a className="btn btn-primary info-contact-link" href={`mailto:${page.email}`}>
              {page.email}
            </a>
          )}
        </section>
        <div className="info-content">
          {page.sections.map((section) => <InfoSection key={section.heading} section={section} />)}
        </div>
      </div>
    </main>
  )
}
