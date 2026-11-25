import { useEffect, useMemo, useState } from 'react'
import supplierRecords from '../data/suppliers.json'

const categoryLabels = {
  building: 'Building materials',
  hardware: 'Hardware & tools',
  electronics: 'Electronics',
  computer: 'Computer hardware',
  manufactured: 'Manufactured goods',
  industrial: 'Industrial',
  furniture: 'Furniture',
  mattresses: 'Mattresses',
  flooring: 'Flooring',
  lighting: 'Lighting',
  home_appliances: 'Home appliances',
  healthcare_medical: 'Healthcare & medical',
  apparel_accessories: 'Apparel & accessories',
  luggage_bags: 'Luggage & bags',
  towels_home_textiles: 'Towels & home textiles',
  stationery: 'Stationery',
  strollers_toys: 'Strollers & toys',
  packaging_materials: 'Packaging materials',
  foodstuff: 'Foodstuff',
  household_tissue: 'Household tissue',
  hardware_fasteners: 'Hardware & fasteners',
  printing_consumables: 'Printing consumables',
  bicycle_lighting: 'Bicycle lighting',
  decoration_materials: 'Decoration materials',
  new_materials: 'New materials',
  commercial_equipment: 'Commercial equipment',
  pet_supplies: 'Pet supplies',
  cosmetics: 'Cosmetics',
  musical_instruments: 'Musical instruments',
  sporting_goods: 'Sporting goods',
  rubber_plastic_parts: 'Rubber & plastic parts',
}

const labelForCategory = (category) => categoryLabels[category] || category
  .replace(/_/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase())

const categories = [...new Set(supplierRecords.map((supplier) => supplier.category))]
  .sort((a, b) => labelForCategory(a).localeCompare(labelForCategory(b)))
const featuredCategoryKeys = ['building', 'electronics', 'industrial', 'manufactured', 'apparel_accessories', 'hardware']
const heroCategories = featuredCategoryKeys.filter((category) => categories.includes(category)).slice(0, 4)
const displayedHeroCategories = heroCategories.length > 0 ? heroCategories : categories.slice(0, 4)

const supplierImagesSupabaseUrl = (
  import.meta.env.VITE_SUPPLIER_IMAGES_SUPABASE_URL ||
  'https://bjdnhjlzlsajrgvdpnxm.supabase.co'
).replace(/\/$/, '')
const supplierImage = (imagePath) => (
  `${supplierImagesSupabaseUrl}/storage/v1/render/image/public/supplier-images/${imagePath}?width=1200&quality=85`
)

function SupplierCard({ supplier }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="supplier-card">
      <div className="supplier-card-image">
        {supplier.image_path && !imageFailed ? (
          <img
            src={supplierImage(supplier.image_path)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{supplier.name.slice(0, 1)}</span>
        )}
        {supplier.verified && <span className="supplier-verified">Verified</span>}
      </div>
      <div className="supplier-card-content">
        <p className="supplier-category">{labelForCategory(supplier.category)}</p>
        <h2>{supplier.name}</h2>
        <p className="supplier-location">{supplier.location}</p>
        {supplier.description && <p className="supplier-description">{supplier.description}</p>}
        {supplier.products.length > 0 && (
          <ul className="supplier-products">
            {supplier.products.map((product) => (
              <li key={product.id}>
                <span>{product.name}</span>
                {product.unit_price != null && (
                  <strong>
                    US${Number(product.unit_price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    {' / '}{product.unit || 'unit'}
                  </strong>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="supplier-card-footer">
          {supplier.terms && <span>Terms: <strong>{supplier.terms}</strong></span>}
        </div>
      </div>
    </article>
  )
}

export default function SuppliersPage() {
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const requestedCategories = new URLSearchParams(window.location.search).get('category')
    return requestedCategories
      ? requestedCategories.split(',').filter((category) => categories.includes(category))
      : []
  })
  const normalizedQuery = query.trim().toLowerCase()

  useEffect(() => {
    document.title = 'Suppliers | ZinoBNPL'
  }, [])

  const filteredSuppliers = useMemo(() => supplierRecords.filter((supplier) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(supplier.category)) return false
    if (!normalizedQuery) return true

    return [
      supplier.name,
      supplier.location,
      supplier.description,
      ...supplier.products.map((product) => product.name),
    ].some((value) => value?.toLowerCase().includes(normalizedQuery))
  }), [normalizedQuery, selectedCategories])

  return (
    <main id="top" className="suppliers-page">
      <section className="wrap suppliers-hero">
        <div>
          <p className="eyebrow">Verified supplier network</p>
          <h1>Build your next order with trusted partners.</h1>
          <p className="suppliers-lede">
            Discover established manufacturers, compare capabilities and source with confidence.
            Explore verified suppliers across the categories your business needs.
          </p>
          <p className="supplier-count" aria-label={`${supplierRecords.length} verified suppliers across ${categories.length} categories`}>
            <strong>{supplierRecords.length}</strong>
            <span>verified suppliers</span>
            <span className="supplier-count-divider" aria-hidden="true">·</span>
            <span>{categories.length} categories</span>
          </p>
          <div className="supplier-hero-actions">
            <a className="btn btn-primary" href="#supplier-invite">
              Become an approved supplier
            </a>
          </div>
        </div>
        <aside className="supplier-hero-discovery" aria-labelledby="supplier-hero-discovery-title">
          <p className="eyebrow">Browse the network</p>
          <h2 id="supplier-hero-discovery-title">Find suppliers by category</h2>
          <p className="supplier-hero-discovery-copy">Start with the products and capabilities your business needs.</p>
          <div className="supplier-hero-category-grid">
            {displayedHeroCategories.map((category) => (
              <a key={category} href={`/suppliers?category=${encodeURIComponent(category)}#supplier-catalogue`}>
                {labelForCategory(category)}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <a className="supplier-hero-all" href="#supplier-catalogue">
            View all suppliers <span aria-hidden="true">→</span>
          </a>
        </aside>
      </section>

      <section id="supplier-catalogue" className="supplier-catalogue" aria-label="Supplier catalogue">
        <div className="wrap">
          <form className="supplier-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="supplier-search-input">
              <span className="supplier-search-icon" aria-hidden="true">⌕</span>
              <span className="sr-only">Search suppliers</span>
              <input
                type="search"
                placeholder="Search supplier, location or what they make"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            {query && (
              <button className="btn btn-ghost supplier-clear" type="button" onClick={() => setQuery('')}>
                Clear
              </button>
            )}
          </form>

          <div className="supplier-filters" aria-label="Filter by category">
            <button
              type="button"
              className={`supplier-filter${selectedCategories.length === 0 ? ' active' : ''}`}
              aria-pressed={selectedCategories.length === 0}
              onClick={() => setSelectedCategories([])}
            >
              All categories <span>{supplierRecords.length}</span>
            </button>
            {categories.map((category) => {
              const count = supplierRecords.filter((supplier) => supplier.category === category).length
              const active = selectedCategories.includes(category)
              return (
                <button
                  key={category}
                  type="button"
                  className={`supplier-filter${active ? ' active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setSelectedCategories([category])}
                >
                  {labelForCategory(category)} <span>{count}</span>
                </button>
              )
            })}
          </div>

          <p className="supplier-results" role="status" aria-live="polite">
            {normalizedQuery || selectedCategories.length > 0
              ? `${filteredSuppliers.length} supplier${filteredSuppliers.length === 1 ? '' : 's'} found`
              : `${supplierRecords.length} supplier profiles`}
          </p>
          {filteredSuppliers.length > 0 ? (
            <div className="supplier-grid">
              {filteredSuppliers.map((supplier) => <SupplierCard key={supplier.id} supplier={supplier} />)}
            </div>
          ) : (
            <div className="supplier-empty">
              <h2>No suppliers found</h2>
              <p>Try a different search or select another category.</p>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => { setQuery(''); setSelectedCategories([]) }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="supplier-onboarding band">
        <div className="wrap">
          <div className="supplier-onboarding-heading">
            <p className="eyebrow">For suppliers</p>
            <h2>Make your factory easier to discover.</h2>
            <p>
              Zinobnpl's published supplier programme is for factories based in China.
              It asks prospective suppliers to introduce their company and export experience,
              complete verification, and then fulfil confirmed orders.
            </p>
          </div>
          <div className="supplier-steps">
            <article>
              <span>01</span>
              <h3>Introduce your factory</h3>
              <p>Share your company profile, product range and export experience.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Complete verification</h3>
              <p>Registration, export licence, production capability and trade references are reviewed.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Receive confirmed orders</h3>
              <p>zinobnpl states that confirmed orders are paid in full before production begins.</p>
            </article>
          </div>
          <div className="supplier-contact">
            <p>For zinobnpl supplier enquiries</p>
            <a href="mailto:suppliers@zinobnpl.com?subject=Supplier%20verification%20with%20zinobnpl">
              suppliers@zinobnpl.com
            </a>
          </div>
        </div>
      </section>

      <section id="supplier-invite" className="supplier-invite" aria-labelledby="supplier-invite-title">
        <div className="wrap">
          <div className="supplier-invite-card">
            <div className="supplier-invite-copy">
              <p className="eyebrow">Supplier partnerships</p>
              <h2 id="supplier-invite-title">Are you a supplier or manufacturer in China?</h2>
              <p>Join our network as an approved supplier. Start your onboarding and introduce your business to buyers worldwide.</p>
            </div>
            <div className="supplier-invite-actions">
              <a className="btn btn-primary" href="/recommend-supplier?request=onboarding">
                Click to onboard
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
