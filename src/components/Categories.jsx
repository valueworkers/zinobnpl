const cats = [
  { label: 'Electronics & components', categories: ['electronics'] },
  { label: 'LED & electricals', categories: ['lighting', 'bicycle_lighting'] },
  { label: 'Hardware & tools', categories: ['hardware_fasteners'] },
  { label: 'Machinery & spare parts', categories: ['commercial_equipment', 'hardware_fasteners'] },
  { label: 'Auto parts', categories: ['hardware_fasteners'] },
  { label: 'Packaging materials', categories: ['packaging_materials'] },
  { label: 'Textiles & trims', categories: ['apparel_accessories', 'towels_home_textiles'] },
  { label: 'Home & kitchenware', categories: ['furniture', 'home_appliances', 'decoration_materials', 'mattresses'] },
  { label: 'Stationery & gifting', categories: ['stationery', 'printing_consumables'] },
  { label: 'Plastics & moulded parts', categories: ['rubber_plastic_parts'] },
]

export default function Categories() {
  return (
    <section className="wrap" style={{ paddingTop: 0 }}>
      <div className="head">
        <p className="eyebrow">What you can buy</p>
        <h2>Stock the shelf, the shop floor and the workshop.</h2>
      </div>
      <div className="cats">
        {cats.map(({ label, categories }) => (
          <a key={label} href={`/suppliers?category=${categories.join(',')}#supplier-catalogue`}>
            {label}
          </a>
        ))}
      </div>
      <p className="cats-note">Some goods require product certifications, permits or import licences to clear customs. Requirements vary by product and destination country, so check the rules before you order.</p>
    </section>
  )
}
