import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fading, setFading] = useState(false)
  const recentIds = useRef([])

  useEffect(() => {
    async function fetchJokes() {
      try {
        const res = await fetch('https://api.freeapi.app/api/v1/public/randomjokes?page=1&limit=100')
        const data = await res.json()
        setJokes(data.data.data)
      } finally {
        setLoading(false)
      }
    }
    fetchJokes()
  }, [])

  function nextJoke() {
    setFading(true)
    setTimeout(() => {
      const pool = jokes.filter(j => !recentIds.current.includes(j.id))
      const pick = (pool.length ? pool : jokes)[Math.floor(Math.random() * (pool.length || jokes.length))]
      recentIds.current = [...recentIds.current, pick.id].slice(-5)
      setIndex(jokes.indexOf(pick))
      setFading(false)
    }, 250)
  }

  const joke = jokes[index]

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <span className="tag">Playful Jokes Lab</span>
          <h1 className="title">Punchline Playground</h1>
          <p className="subtitle">Tap the button for a fresh, random joke. Built for quick laughs and bright vibes.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="shape circle" />
          <span className="shape square" />
          <span className="shape triangle" />
          <span className="icon-bubble">
            <Sparkles className="icon" strokeWidth={2.5} />
          </span>
        </div>
      </header>

      <section className={`card ${fading || loading ? 'fade-out' : 'fade-in'}`}>
        <div className="card-top">
          <span className="card-label">Today's Pick</span>
          <span className="card-dot" />
        </div>
        {loading || !joke
          ? (
            <div className="skeleton">
              <div className="sk-line w90" />
              <div className="sk-line w70" />
              <div className="sk-line w80" />
            </div>
          )
          : <p className="joke">{joke.content}</p>
        }
      </section>

      <button className="btn" onClick={nextJoke} disabled={loading} type="button">
        Next Joke
        <span className="btn-icon" aria-hidden="true">
          <ArrowRight className="icon" strokeWidth={2.5} />
        </span>
      </button>
    </div>
  )
}

export default App