export default function Welcome() {
  return (
    <section className="wrap" style={{ paddingTop: '2rem' }}>
      <div className="welcome">
        <div>
          <p className="eyebrow">Welcome to ZinoBNPL</p>
          <h2 style={{ marginTop: '1rem' }}>An approved line of trade credit for buying from China.</h2>
        </div>
        <div className="big">
          <p>ZinoBNPL gives genuine, registered businesses worldwide an approved trade credit line with a 20% deposit and no security.</p>
          <p>Pay a 20% deposit to confirm an order and your goods are produced and shipped. You settle the balance later on the terms you were approved for. No property security and no personal guarantee.</p>
          <div className="welcome-supplier-note">
            <p><strong>Already working with a supplier in China?</strong> You can continue purchasing from them. Submit their website and business details, and we’ll verify them for our approved supplier network.</p>
            <a className="btn btn-ghost" href="/recommend-supplier?request=recommendation">Submit supplier details</a>
          </div>
        </div>
      </div>
    </section>
  )
}
