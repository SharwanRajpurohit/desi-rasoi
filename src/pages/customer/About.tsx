export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Our Story</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal">
        From the Kitchens of Rajasthan
      </h1>
      <p className="mt-6 text-warm-gray leading-relaxed">
        Desi Rasoi was born out of a simple desire: to share the authentic flavours of Rajasthan
        with the world. Every product in our catalog is inspired by centuries-old recipes passed
        down through generations — from the sweet shops of Jaipur to the desert kitchens of
        Jodhpur and the haveli pantries of Bikaner.
      </p>
      <p className="mt-4 text-warm-gray leading-relaxed">
        We work directly with artisan producers across Rajasthan who use traditional methods —
        stone-ground spices, slow-cooked sweets, and sun-dried pickles — to ensure every bite
        carries the true taste of our heritage.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { emoji: '🏺', title: 'Artisan Made', desc: 'Small-batch, traditional recipes' },
          { emoji: '🌾', title: 'Local Sourcing', desc: 'Ingredients from Rajasthan' },
          { emoji: '📦', title: 'Fresh Delivery', desc: 'Direct from producer to you' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl bg-white p-5 shadow-card text-center">
            <span className="text-3xl">{item.emoji}</span>
            <p className="mt-2 font-semibold text-charcoal">{item.title}</p>
            <p className="mt-1 text-xs text-warm-gray">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-xl bg-brand/5 border border-brand/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-2">Demo Note</p>
        <p className="text-sm text-warm-gray">
          This is a portfolio demo. No real orders are processed. Admin credentials: <code className="rounded bg-white px-1 text-charcoal">admin / desirasoi2026</code>
        </p>
      </div>
    </div>
  )
}
