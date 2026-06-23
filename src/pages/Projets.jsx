import { Search, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'

const DOMAINES = ['Tous', 'Éducation', 'Santé', 'Agriculture', 'Environnement', 'Culture', 'Sport']
const REGIONS  = ['Toutes les régions', 'Dakar', 'Kaolack', 'Saint-Louis', 'Matam', 'Kolda', 'Ziguinchor']
const API_URL  = 'https://diaspoconnect-backend.onrender.com/api'

export default function Projets() {
  const [projets,    setProjets]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [domaine,    setDomaine]    = useState('Tous')
  const [region,     setRegion]     = useState('Toutes les régions')
  const [urgentOnly, setUrgentOnly] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/projets`)
      .then(r => r.json())
      .then(data => {
        setProjets(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = projets.filter(p => {
    const matchSearch  = p.titre?.toLowerCase().includes(search.toLowerCase()) ||
                         p.localite?.toLowerCase().includes(search.toLowerCase())
    const matchDomaine = domaine === 'Tous' || p.domaine === domaine
    const matchRegion  = region === 'Toutes les régions' || p.region === region
    const matchUrgent  = !urgentOnly || p.urgent
    return matchSearch && matchDomaine && matchRegion && matchUrgent
  })

  const urgents    = filtered.filter(p => p.urgent)
  const nonUrgents = filtered.filter(p => !p.urgent)

  return (
    <div>
      {/* Header */}
      <section className="hero-pattern py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Projets solidaires
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Tous les projets
          </h1>
          <p className="text-white/70 mb-8">
            {loading ? 'Chargement...' : `${projets.length} projets publiés sur la plateforme`}
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un projet, une localité..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
            />
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-10 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Filtres */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                urgentOnly
                  ? 'bg-red-500 text-white border-red-500'
                  : 'border-red-300 text-red-500 hover:bg-red-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Urgents seulement
            </button>
            <select
              value={domaine}
              onChange={e => setDomaine(e.target.value)}
              className="border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm bg-white focus:outline-none focus:border-primary"
            >
              {DOMAINES.map(d => <option key={d}>{d}</option>)}
            </select>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm bg-white focus:outline-none focus:border-primary"
            >
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <span className="text-gray-500 text-sm ml-auto">
              {filtered.length} résultats
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Chargement des projets...</div>
          ) : (
            <>
              {urgents.length > 0 && (
                <div className="mb-10">
                  <span className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                    ⚠ PROJETS URGENTS
                  </span>
                  <div className="grid md:grid-cols-2 gap-5">
                    {urgents.map(p => <ProjectCard key={p.id} projet={p} />)}
                  </div>
                </div>
              )}

              {nonUrgents.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-5">Autres projets</h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {nonUrgents.map(p => <ProjectCard key={p.id} projet={p} />)}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">Aucun projet trouvé.</div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}