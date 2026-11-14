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

const supplierImage = (imagePath) => (
  `https://bjdnhjlzlsajrgvdpnxm.supabase.co/storage/v1/render/image/public/supplier-images/${imagePath}?width=760&quality=65`
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
          {supplier.website ? (
            <a href={supplier.website} target="_blank" rel="noreferrer">Visit website</a>
          ) : (
            <span>China-based supplier</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function SuppliersPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const normalizedQuery = query.trim().toLowerCase()

  useEffect(() => {
    document.title = 'Suppliers | ZinoBNPL'
  }, [])

  const filteredSuppliers = useMemo(() => supplierRecords.filter((supplier) => {
    if (selectedCategory !== 'all' && supplier.category !== selectedCategory) return false
    if (!normalizedQuery) return true

    return [
      supplier.name,
      supplier.location,
      supplier.description,
      ...supplier.products.map((product) => product.name),
    ].some((value) => value?.toLowerCase().includes(normalizedQuery))
  }), [normalizedQuery, selectedCategory])

  return (
    <main id="top" className="suppliers-page">
      <section className="wrap suppliers-hero">
        <div>
          <p className="eyebrow">The supplier catalogue</p>
          <h1>Find the right partner for your next order.</h1>
          <p className="suppliers-lede">
            Explore verified manufacturers across the categories wholesale buyers need.
            Browse supplier profiles, locations and product capabilities.
          </p>
        </div>
        <aside className="supplier-summary" aria-label="Catalogue overview">
          <span className="supplier-summary-mark" aria-hidden="true">✓</span>
          <p className="eyebrow">Public catalogue</p>
          <strong>{supplierRecords.length}</strong>
          <p>verified suppliers across {categories.length} categories</p>
          <span className="supplier-summary-note">Supplier details from Jinport's public listings</span>
        </aside>
      </section>

      <section className="supplier-catalogue" aria-label="Supplier catalogue">
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
              className={`supplier-filter${selectedCategory === 'all' ? ' active' : ''}`}
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              All categories <span>{supplierRecords.length}</span>
            </button>
            {categories.map((category) => {
              const count = supplierRecords.filter((supplier) => supplier.category === category).length
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  className={`supplier-filter${active ? ' active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                >
                  {labelForCategory(category)} <span>{count}</span>
                </button>
              )
            })}
          </div>

          <p className="supplier-results" role="status" aria-live="polite">
            {normalizedQuery || selectedCategory !== 'all'
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
                onClick={() => { setQuery(''); setSelectedCategory('all') }}
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
              Jinport's published supplier programme is for factories based in China.
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
              <p>Jinport states that confirmed orders are paid in full before production begins.</p>
            </article>
          </div>
          <div className="supplier-contact">
            <p>For Jinport supplier enquiries</p>
            <a href="mailto:suppliers@jinport.com?subject=Supplier%20verification%20with%20Jinport">
              suppliers@jinport.com
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
