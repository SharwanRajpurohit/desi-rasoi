import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'

interface Slide {
  id: string
  tag: string
  title: string
  titleHi: string
  desc: string
  gradient: string
  pattern: 'dots' | 'diagonals' | 'crosshatch' | 'diamonds' | 'waves'
  accent: string   // highlight colour for the tag pill bg
}

const SLIDES: Slide[] = [
  {
    id: 'taste',
    tag: '🏺 Traditional · Authentic · Rajasthani',
    title: 'Taste of Rajasthan',
    titleHi: 'राजस्थान का स्वाद, आपके द्वार',
    desc: 'From Ghevar to Ker Sangri — authentic flavours crafted in Rajasthani kitchens and delivered right to your door.',
    gradient: 'from-[#C0392B] via-[#922B21] to-[#3D1C14]',
    pattern: 'dots',
    accent: 'bg-white/10',
  },
  {
    id: 'sweets',
    tag: '🍬 Handcrafted · Festive · Artisanal',
    title: 'Festival of Sweets',
    titleHi: 'मिठाई का त्योहार',
    desc: 'Celebrate every occasion with Ghevar, Mawa Kachori, Churma Ladoo and more — straight from the mithai artisans of Jaipur.',
    gradient: 'from-[#B8860B] via-[#8B6914] to-[#4A3508]',
    pattern: 'diagonals',
    accent: 'bg-yellow-300/10',
  },
  {
    id: 'spices',
    tag: '🌶️ Aromatic · Bold · Time-Honoured',
    title: 'The Spice Route',
    titleHi: 'राजस्थान के मसाले',
    desc: 'Laal Maas Masala, Garam Masala, Dhania Powder — the bold aromas of Thar desert blends delivered to your kitchen.',
    gradient: 'from-[#2C1F54] via-[#4B2A6B] to-[#8B1A1A]',
    pattern: 'crosshatch',
    accent: 'bg-purple-300/10',
  },
  {
    id: 'gift',
    tag: '🎁 Curated · Premium · Perfect Gifting',
    title: 'Gift the Heritage',
    titleHi: 'विरासत का उपहार',
    desc: 'Delight your loved ones with beautifully curated Rajasthani hampers — the most thoughtful gift from the land of kings.',
    gradient: 'from-[#1A4A1A] via-[#2D5A1B] to-[#3D2B0F]',
    pattern: 'diamonds',
    accent: 'bg-green-300/10',
  },
  {
    id: 'desert',
    tag: '🌾 Farm-Fresh · Natural · Pure',
    title: 'Fresh from the Desert',
    titleHi: 'थार की ताजगी',
    desc: "Ker Sangri, heirloom grains, desert spices — sourced directly from Rajasthan's heartland for pure, unadulterated taste.",
    gradient: 'from-[#8B4513] via-[#A0522D] to-[#4A2208]',
    pattern: 'waves',
    accent: 'bg-orange-200/10',
  },
]

function Pattern({ type }: { type: Slide['pattern'] }) {
  const base = 'pointer-events-none absolute inset-0 opacity-[0.06]'
  if (type === 'dots')
    return <div className={base} style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
  if (type === 'diagonals')
    return <div className={base} style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
  if (type === 'crosshatch')
    return <div className={base} style={{ backgroundImage: 'repeating-linear-gradient(0deg, white 0, white 1px, transparent 0, transparent 24px), repeating-linear-gradient(90deg, white 0, white 1px, transparent 0, transparent 24px)' }} />
  if (type === 'diamonds')
    return <div className={base} style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 16px), repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 16px)' }} />
  if (type === 'waves')
    return <div className={base} style={{ backgroundImage: 'repeating-radial-gradient(ellipse at 50% 0%, transparent 0%, transparent 45%, white 50%, transparent 55%)', backgroundSize: '30px 30px' }} />
  return null
}

const INTERVAL = 5000

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 600)
  }
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length)
  const next = () => goTo((current + 1) % SLIDES.length)

  useEffect(() => {
    if (paused) { timerRef.current && clearInterval(timerRef.current); return }
    timerRef.current = setInterval(next, INTERVAL)
    return () => { timerRef.current && clearInterval(timerRef.current) }
  }, [current, paused])

  const slide = SLIDES[current]

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient} px-4 py-20 text-white transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Pattern type={slide.pattern} />

      {/* Content */}
      <div
        key={slide.id}
        className="relative mx-auto max-w-4xl text-center"
        style={{ animation: 'fadeSlideUp 0.55s ease both' }}
      >
        <span className={`inline-block rounded-full ${slide.accent} px-4 py-1 text-sm font-medium backdrop-blur mb-4 border border-white/10`}>
          {slide.tag}
        </span>

        <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-sm">
          {slide.title}
        </h1>

        <p className="mt-2 font-hindi text-xl text-white/80">{slide.titleHi}</p>

        <p className="mx-auto mt-5 max-w-xl text-lg text-white/75 leading-relaxed">
          {slide.desc}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/products">
            <Button size="lg" variant="secondary" icon={<ShoppingBag className="h-5 w-5" />}>
              Shop Now
            </Button>
          </Link>
          <Link to="/about">
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/50 text-white hover:bg-white hover:text-brand transition-colors"
            >
              Our Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/25 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/25 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'h-2.5 w-7 bg-white'
                : 'h-2 w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full">
          <div
            key={`${slide.id}-progress`}
            className="h-full bg-white/70"
            style={{ animation: `progressBar ${INTERVAL}ms linear both` }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  )
}
