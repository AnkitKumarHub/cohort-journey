import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Play, Sparkles, Tag, Utensils } from 'lucide-react'
import './App.css'

function MealCard({ meal }) {
  const ingredients = Array.from({ length: 10 }, (_, i) => meal[`strIngredient${i + 1}`]).filter(Boolean)

  return (
    <div className="card">
      <div className="thumb">
        <span className="tape" aria-hidden="true" />
        <img src={meal.strMealThumb} alt={meal.strMeal} />
      </div>
      <div className="card-body">
        <h2 className="title">{meal.strMeal}</h2>
        <div className="tags">
          <span className="tag">
            <Tag className="tag-icon" aria-hidden="true" strokeWidth={2.5} />
            {meal.strCategory}
          </span>
          <span className="tag">
            <MapPin className="tag-icon" aria-hidden="true" strokeWidth={2.5} />
            {meal.strArea}
          </span>
        </div>
        <p className="ingredients">
          <Utensils className="tag-icon" aria-hidden="true" strokeWidth={2.5} />
          {ingredients.slice(0, 6).join(', ')}{ingredients.length > 6 ? '...' : ''}
        </p>
        {meal.strYoutube && (
          <a className="yt-link" href={meal.strYoutube} target="_blank" rel="noreferrer">
            <span className="yt-icon" aria-hidden="true">
              <Play className="icon" strokeWidth={2.5} />
            </span>
            Watch Recipe
          </a>
        )}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card skeleton">
      <div className="thumb">
        <span className="tape" aria-hidden="true" />
        <div className="sk-img" />
      </div>
      <div className="card-body">
        <div className="sk-line w70" />
        <div className="sk-line w40" />
        <div className="sk-line w90" />
      </div>
    </div>
  )
}

function App() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    async function fetchMeals() {
      try {
        const res = await fetch(`https://api.freeapi.app/api/v1/public/meals?page=${page}&limit=12`)
        const data = await res.json()
        setMeals(data.data.data)
        setTotalPages(data.data.totalPages)
      } catch {
        setError('Failed to load meals')
      } finally {
        setLoading(false)
      }
    }
    fetchMeals()
  }, [page])

  if (error) return <div className="status">{error}</div>

  return (
    <div className="app">
      <header className="header">
        <div className="header-text">
          <span className="eyebrow">
            <Sparkles className="eyebrow-icon" aria-hidden="true" strokeWidth={2.5} />
            Hand Drawn Meals
          </span>
          <h1>Meal Sketchbook</h1>
          <p className="subtitle">A playful index of recipes with scribbled notes and hand-cut cards.</p>
        </div>
        <div className="header-art" aria-hidden="true">
          <div className="note">
            <span className="note-pin" />
            <span className="note-line" />
            <span className="note-line short" />
            <span className="note-icon">
              <Utensils className="icon" strokeWidth={2.5} />
            </span>
          </div>
          <span className="doodle doodle-circle" />
          <span className="doodle doodle-zigzag" />
        </div>
      </header>
      <div className="grid">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : meals.map(meal => <MealCard key={meal.idMeal} meal={meal} />)
        }
      </div>
      <div className="pagination">
        <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1 || loading}>
          <ArrowLeft className="icon" aria-hidden="true" strokeWidth={2.5} />
          Prev
        </button>
        <span className="page-count">Page {page} of {totalPages}</span>
        <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages || loading}>
          Next
          <ArrowRight className="icon" aria-hidden="true" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default App