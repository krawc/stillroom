import { useState, type FormEvent } from 'react'
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coffee,
  Heart,
  Map,
  MapPin,
  Plug,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Wifi,
  X,
} from 'lucide-react'
import './App.css'

type Desk = {
  id: number
  name: string
  neighborhood: string
  distance: string
  price: number
  rating: number
  reviews: number
  category: string
  image: string
  imageAlt: string
  description: string
  amenities: string[]
  mapX: number
  mapY: number
}

type Dialog = { type: 'details' | 'booking' | 'confirmed'; space: Desk } | null

const spaces: Desk[] = [
  {
    id: 1,
    name: 'The Assembly',
    neighborhood: 'DUMBO',
    distance: '0.3 mi away',
    price: 6,
    rating: 4.96,
    reviews: 84,
    category: 'Studio',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Sunlit communal worktable in a leafy creative studio',
    description: 'A light-filled studio tucked above the neighborhood. Come for the calm, stay for the excellent coffee.',
    amenities: ['Quiet room', 'Fast Wi-Fi', 'Power at every seat', 'Coffee included'],
    mapX: 43,
    mapY: 40,
  },
  {
    id: 2,
    name: 'Sunday Works',
    neighborhood: 'BROOKLYN HEIGHTS',
    distance: '0.7 mi away',
    price: 8,
    rating: 4.91,
    reviews: 52,
    category: 'Private office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Quiet modern office with desks and natural light',
    description: 'A quiet corner office for deep work, with generous daylight and room to spread out.',
    amenities: ['Private desk', 'Fast Wi-Fi', 'Power at every seat', 'Coffee included'],
    mapX: 64,
    mapY: 57,
  },
  {
    id: 3,
    name: 'Daytrip Coffee',
    neighborhood: 'FORT GREENE',
    distance: '1.1 mi away',
    price: 4,
    rating: 4.88,
    reviews: 126,
    category: 'Cafe desk',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Warm independent cafe with a long shared table',
    description: 'A proper cafe table, a good oat flat white, and no side-eye for opening your laptop.',
    amenities: ['Cafe atmosphere', 'Fast Wi-Fi', 'Power at every seat', 'Coffee included'],
    mapX: 76,
    mapY: 33,
  },
  {
    id: 4,
    name: 'Common Ground',
    neighborhood: 'BOERUM HILL',
    distance: '1.4 mi away',
    price: 5,
    rating: 4.93,
    reviews: 67,
    category: 'Lounge',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Airy shared workspace with plants and comfortable seating',
    description: 'A plant-filled lounge with comfortable chairs, focused zones, and an easy come-and-go feel.',
    amenities: ['Quiet room', 'Fast Wi-Fi', 'Power at every seat', 'Coffee included'],
    mapX: 36,
    mapY: 69,
  },
  {
    id: 5,
    name: 'The Paper Room',
    neighborhood: 'COBBLE HILL',
    distance: '1.8 mi away',
    price: 7,
    rating: 4.97,
    reviews: 39,
    category: 'Studio',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Minimal creative studio with communal desks',
    description: 'A small, considered workspace for the days you need a little more room to think.',
    amenities: ['Quiet room', 'Fast Wi-Fi', 'Power at every seat', 'Coffee included'],
    mapX: 55,
    mapY: 82,
  },
  {
    id: 6,
    name: 'Elsewhere Desk Club',
    neighborhood: 'WILLIAMSBURG',
    distance: '2.2 mi away',
    price: 5,
    rating: 4.89,
    reviews: 103,
    category: 'Cafe desk',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Bright flexible coworking area with plenty of desk space',
    description: 'A relaxed desk in a friendly neighborhood space. Book a few hours, no membership required.',
    amenities: ['Quiet room', 'Fast Wi-Fi', 'Power at every seat', 'Coffee included'],
    mapX: 82,
    mapY: 72,
  },
]

const today = new Date().toLocaleDateString('en-CA')

function App() {
  const [location, setLocation] = useState('Brooklyn, New York')
  const [appliedLocation, setAppliedLocation] = useState('Brooklyn, New York')
  const [date, setDate] = useState(today)
  const [startTime, setStartTime] = useState('09:00')
  const [duration, setDuration] = useState('3')
  const [quietOnly, setQuietOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const [mapView, setMapView] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [dialog, setDialog] = useState<Dialog>(null)

  const filteredSpaces = spaces
    .filter((space) => {
      const query = appliedLocation.trim().toLowerCase()
      const isBrooklynArea = ['brooklyn', 'new york', 'nyc', 'all'].some((place) => query.includes(place))
      const matchesLocation = !query || isBrooklynArea
        || `${space.name} ${space.neighborhood}`.toLowerCase().includes(query)
      const matchesQuiet = !quietOnly || space.amenities.includes('Quiet room')
      return matchesLocation && matchesQuiet
    })
    .sort((first, second) => {
      if (sortBy === 'price') return first.price - second.price
      if (sortBy === 'rating') return second.rating - first.rating
      return first.id - second.id
    })

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedLocation(location)
  }

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id])
  }

  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Stillroom home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>stillroom</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link nav-link-active" href="#spaces">Find a desk</a>
          <a className="nav-link" href="#how-it-works">How it works</a>
        </nav>
        <button className="host-link" type="button" onClick={() => setDialog({ type: 'details', space: spaces[0] })}>
          List your space <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </header>

      <main id="top">
        <section className="intro-section" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow"><span className="status-dot" /> GOOD WORK, ON YOUR TERMS</p>
            <h1 id="page-title">A desk for<br />the <em>hours</em> you need.</h1>
            <p className="intro-description">Find your focus nearby. Book by the hour, pay as you go. No membership, no strings.</p>
            <div className="proof-points">
              <span><Check size={14} /> From $4 / hour</span>
              <span><Check size={14} /> Free cancellation</span>
              <span><Check size={14} /> No subscription</span>
            </div>
          </div>
          <div className="intro-photo" role="img" aria-label="Bright, plant-filled desk in a shared workspace">
            <div className="photo-caption"><span className="caption-pip" /> A good place to begin <span>·</span> Brooklyn, NY</div>
            <div className="photo-stamp"><span>ROOM</span><strong>to<br />think.</strong><span>EST. TODAY</span></div>
          </div>
        </section>

        <form className="search-panel" onSubmit={handleSearch}>
          <label className="search-field location-field">
            <span className="field-label"><MapPin size={14} /> WHERE</span>
            <input aria-label="Location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Neighborhood or city" />
          </label>
          <label className="search-field date-field">
            <span className="field-label"><CalendarDays size={14} /> WHEN</span>
            <input aria-label="Date" type="date" value={date} min={today} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="search-field time-field">
            <span className="field-label"><Clock3 size={14} /> START TIME</span>
            <input aria-label="Start time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
          </label>
          <label className="search-field duration-field">
            <span className="field-label"><Clock3 size={14} /> HOW LONG</span>
            <select aria-label="Duration" value={duration} onChange={(event) => setDuration(event.target.value)}>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="6">6 hours</option>
              <option value="8">Full day</option>
            </select>
            <ChevronDown className="select-chevron" size={14} aria-hidden="true" />
          </label>
          <button className="search-button" type="submit"><Search size={17} /> <span>Find a desk</span></button>
        </form>

        <section className="results-section" id="spaces" aria-labelledby="results-title">
          <div className="results-heading">
            <div>
              <p className="section-kicker">YOUR NEXT GOOD WORKDAY</p>
              <h2 id="results-title">Desks around <span>{appliedLocation || 'you'}</span></h2>
              <p className="results-date">{formattedDate} <span>·</span> {duration === '8' ? 'Full day' : `${duration} hours`} from {startTime}</p>
            </div>
            <div className="result-actions">
              <label className="sort-control"><ArrowDownUp size={14} /><span className="sr-only">Sort spaces</span>
                <select aria-label="Sort spaces" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price">Lowest price</option>
                  <option value="rating">Top rated</option>
                </select><ChevronDown size={13} />
              </label>
              <button className={`view-toggle${mapView ? ' is-active' : ''}`} type="button" aria-pressed={mapView} onClick={() => setMapView((current) => !current)}>
                <Map size={15} /> {mapView ? 'Show list' : 'Map'}
              </button>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-context"><SlidersHorizontal size={15} /><span>Filter</span><span className="filter-divider" /></div>
            <button className={`filter-chip${quietOnly ? ' selected' : ''}`} type="button" aria-pressed={quietOnly} onClick={() => setQuietOnly((current) => !current)}>
              <span className="chip-dot" /> Quiet spaces
            </button>
            <span className="filter-chip filter-chip-static"><Wifi size={14} /> Fast Wi-Fi</span>
            <span className="filter-chip filter-chip-static"><Plug size={14} /> Power at every seat</span>
            <span className="filter-count">{filteredSpaces.length} spaces</span>
          </div>

          {mapView ? (
            <div className="map-canvas" aria-label="Map of available desks in Brooklyn">
              <div className="map-water water-one" /><div className="map-water water-two" />
              <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
              <span className="map-district district-one">DUMBO</span><span className="map-district district-two">BROOKLYN HEIGHTS</span><span className="map-district district-three">FORT GREENE</span><span className="map-district district-four">BOERUM HILL</span>
              {filteredSpaces.map((space) => <button key={space.id} className="map-price" style={{ left: `${space.mapX}%`, top: `${space.mapY}%` }} onClick={() => setDialog({ type: 'details', space })} aria-label={`${space.name}, $${space.price} per hour`}>${space.price}<small>/hr</small></button>)}
              <div className="map-note"><MapPin size={15} /> {filteredSpaces.length} bookable spots <span>·</span> no membership</div>
            </div>
          ) : filteredSpaces.length ? (
            <div className="space-grid">
              {filteredSpaces.map((space, index) => (
                <article className="space-card" key={space.id} style={{ animationDelay: `${index * 65}ms` }}>
                  <button className="space-image-button" type="button" onClick={() => setDialog({ type: 'details', space })} aria-label={`View ${space.name}`}>
                    <img className="space-image" src={space.image} alt={space.imageAlt} loading="lazy" />
                    <span className="availability-tag"><span /> Available today</span>
                  </button>
                  <button className={`favorite-button${favorites.includes(space.id) ? ' is-favorite' : ''}`} type="button" aria-label={favorites.includes(space.id) ? `Remove ${space.name} from saved spaces` : `Save ${space.name}`} aria-pressed={favorites.includes(space.id)} onClick={() => toggleFavorite(space.id)}>
                    <Heart size={17} fill={favorites.includes(space.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="space-info" type="button" onClick={() => setDialog({ type: 'details', space })}>
                    <span className="space-overline">{space.category} <span>·</span> {space.neighborhood}</span>
                    <span className="space-name-row"><strong>{space.name}</strong><span className="rating"><Star size={13} fill="currentColor" /> {space.rating}</span></span>
                    <span className="space-distance">{space.distance} <span>·</span> {space.reviews} reviews</span>
                    <span className="space-price"><strong>${space.price}</strong> / hour <span className="total-price">· ${(space.price * Number(duration)).toFixed(0)} for {duration} hours</span></span>
                  </button>
                  <button className="card-arrow" type="button" aria-label={`Book ${space.name}`} onClick={() => setDialog({ type: 'booking', space })}><ArrowRight size={17} /></button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><Search size={22} /><h3>No desks found just yet</h3><p>Try “Brooklyn” or “New York” to see nearby spaces.</p><button type="button" onClick={() => { setLocation('Brooklyn, New York'); setAppliedLocation('Brooklyn, New York') }}>Show Brooklyn spaces</button></div>
          )}
        </section>

        <section className="how-it-works" id="how-it-works">
          <div className="how-heading"><span className="section-kicker">LESS COMMITMENT. MORE GETTING IT DONE.</span><h2>Good work needs<br /><em>a place to happen.</em></h2></div>
          <div className="how-steps">
            <div className="how-step"><span className="step-number">01</span><div><h3>Find your kind of quiet</h3><p>Browse real local desks, studios, and cafe spots. Every listing shows the hourly price up front.</p></div></div>
            <div className="how-step"><span className="step-number">02</span><div><h3>Book only what you need</h3><p>Pick a start time and a few hours. No trial period, monthly plan, or awkward cancellation.</p></div></div>
            <div className="how-step"><span className="step-number">03</span><div><h3>Show up and settle in</h3><p>Your spot is ready when you are. Keep the whole day yours, not just the desk.</p></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark"><span /><span /><span /></span><span>stillroom</span></a><span>Room to work. Freedom to go.</span><span>© 2026 Stillroom</span></footer>

      {dialog && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}>
        <section className={`dialog-card dialog-${dialog.type}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <button className="dialog-close" type="button" aria-label="Close" onClick={() => setDialog(null)}><X size={19} /></button>
          {dialog.type === 'details' && <>
            <img className="dialog-image" src={dialog.space.image} alt={dialog.space.imageAlt} />
            <div className="dialog-content">
              <span className="space-overline">{dialog.space.category} <span>·</span> {dialog.space.neighborhood}</span>
              <h2 id="dialog-title">{dialog.space.name}</h2>
              <p className="dialog-description">{dialog.space.description}</p>
              <div className="dialog-rating"><Star size={15} fill="currentColor" /> {dialog.space.rating} <span>({dialog.space.reviews} reviews)</span> <span>·</span> {dialog.space.distance}</div>
              <div className="amenity-list">{dialog.space.amenities.map((amenity) => <span key={amenity}>{amenity.includes('Wi-Fi') ? <Wifi size={15} /> : amenity.includes('Power') ? <Plug size={15} /> : amenity.includes('Coffee') ? <Coffee size={15} /> : <Check size={15} />}{amenity}</span>)}</div>
              <div className="dialog-book-row"><div><strong>${dialog.space.price}</strong> / hour <span>· no membership</span></div><button type="button" onClick={() => setDialog({ type: 'booking', space: dialog.space })}>Choose this desk <ArrowRight size={16} /></button></div>
            </div>
          </>}
          {dialog.type === 'booking' && <div className="booking-content">
            <span className="section-kicker">YOUR WORKDAY, YOUR WAY</span>
            <h2 id="dialog-title">One good desk.<br /><em>Just for today.</em></h2>
            <div className="booking-space"><img src={dialog.space.image} alt="" /><div><strong>{dialog.space.name}</strong><span><MapPin size={13} /> {dialog.space.neighborhood}</span></div></div>
            <div className="booking-line"><span><CalendarDays size={15} /> {formattedDate}</span><span><Clock3 size={15} /> {startTime} · {duration} hours</span></div>
            <div className="price-breakdown"><span>${dialog.space.price} × {duration} hours</span><strong>${(dialog.space.price * Number(duration)).toFixed(2)}</strong></div>
            <div className="price-total"><span>Total · pay once</span><strong>${(dialog.space.price * Number(duration)).toFixed(2)}</strong></div>
            <p className="booking-reassurance"><ShieldCheck size={15} /> Free cancellation up to 2 hours before</p>
            <button className="confirm-button" type="button" onClick={() => setDialog({ type: 'confirmed', space: dialog.space })}>Reserve this desk <ArrowRight size={17} /></button>
            <p className="demo-note">Demo booking · no payment will be taken</p>
          </div>}
          {dialog.type === 'confirmed' && <div className="confirmation-content">
            <span className="confirmation-icon"><CheckCircle2 size={31} /></span>
            <span className="section-kicker">YOUR TIME IS YOURS</span>
            <h2 id="dialog-title">A quiet desk<br /><em>is waiting.</em></h2>
            <p>Your {duration}-hour visit at {dialog.space.name} is penciled in for {formattedDate} at {startTime}.</p>
            <div className="confirmation-ticket"><span>YOUR VISIT</span><strong>{dialog.space.name}</strong><span>{formattedDate} · {startTime} · {duration} hours</span><b>${(dialog.space.price * Number(duration)).toFixed(2)} total</b></div>
            <p className="demo-note">This is a demo confirmation. No payment was taken.</p>
            <button className="confirm-button" type="button" onClick={() => setDialog(null)}>Back to nearby desks <ArrowRight size={17} /></button>
          </div>}
        </section>
      </div>}
    </div>
  )
}

export default App
