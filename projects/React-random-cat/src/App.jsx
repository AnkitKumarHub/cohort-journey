import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Sparkles, PawPrint, MapPin, Clock } from 'lucide-react'
import './App.css'

function App() {
  const [cat, setCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)

  const fetchCat = useCallback(async () => {
    setLoading(true)
    setImgLoaded(false)
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/public/cats/cat/random')
      const data = await res.json()
      setCat(data.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCat() }, [fetchCat])

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <span className="eyebrow">
            <Sparkles className="eyebrow-icon" aria-hidden="true" strokeWidth={2.5} />
            Hand Drawn Cat Club
          </span>
          <h1 className="title">Random Cat Sketchbook</h1>
          <p className="subtitle">
            Handpicked cat profiles with notes, traits, and a playful paper vibe.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="paper-card">
            <span className="tape" />
            <span className="paper-icon">
              <PawPrint className="icon" strokeWidth={2.5} />
            </span>
            <p className="paper-text">New doodle each click.</p>
          </div>
          <span className="doodle doodle-circle float" />
          <span className="doodle doodle-squiggle" />
        </div>
      </header>

      <section className="card card-main">
        <div className="card-top">
          <span className="tag">Cat Profile</span>
          <span className="tag alt">Fresh Pick</span>
        </div>
        <div className="card-content">
          <div className="img-wrap">
            {(!imgLoaded || loading) && <div className="sk-img" />}
            {cat && (
              <img
                src={cat.image}
                alt={cat.name}
                onLoad={() => setImgLoaded(true)}
                style={{ display: imgLoaded ? 'block' : 'none' }}
              />
            )}
          </div>
          {cat && imgLoaded ? (
            <div className="info">
              <h2>{cat.name}</h2>
              <div className="meta">
                <span className="meta-item">
                  <MapPin className="meta-icon" aria-hidden="true" strokeWidth={2.5} />
                  {cat.origin}
                </span>
                <span className="meta-item">
                  <Clock className="meta-icon" aria-hidden="true" strokeWidth={2.5} />
                  Life span: {cat.life_span} yrs
                </span>
              </div>
              <p className="temperament">{cat.temperament}</p>
              <p className="desc">{cat.description}</p>
            </div>
          ) : (
            <div className="info info-skeleton">
              <div className="sk-line wide" />
              <div className="sk-line mid" />
              <div className="sk-line mid" />
              <div className="sk-line short" />
            </div>
          )}
        </div>
      </section>

      <div className="controls">
        <button className="btn" onClick={fetchCat} disabled={loading} type="button">
          {loading ? 'Loading...' : 'Next Cat'}
          <span className="btn-icon" aria-hidden="true">
            <ArrowRight className="icon" strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </div>
  )
}

export default App