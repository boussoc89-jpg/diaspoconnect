import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import AssociationCard from '../components/AssociationCard'
import { associations } from '../data/mockData'

const DOMAINES = ['Éducation', 'Santé', 'Agriculture', 'Entrepreneuriat', 'Environnement', 'Culture', 'Sport']
const BADGES   = ['Certifiée', 'Vérifiée', 'Membre']
const PAYS     = ['Tous les pays', 'France', 'Italie', 'États-Unis', 'Espagne', 'Belgique']

const BADGE_ICON = { Certifiée: '🥇', Vérifiée: '🥈', Membre: '🥉' }

export default function Annuaire() {
  const [search,      setSearch]      = useState('')
  const [domaine,     setDomaine]     = useState([])
  const [badge,       setBadge]       = useState([])
  const [pays,        setPays]        = useState('Tous les pays')
  const [showFilters, setShowFilters] = useState(false)

  const toggleDomaine = (d) =>
    setDomaine(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const toggleBadge = (b) =>
    setBadge(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])

  const resetFilters = () => {
    setDomaine([])
    setBadge([])
    setPays('Tous les pays')
  }

  const hasFilters = domaine.length > 0 || badge.length > 0 || pays !== 'Tous les pays'

  const filtered = associations.filter(a => {
    const matchSearch  = a.nom.toLowerCase().includes(search.toLowerCase()) ||
                         a.description.toLowerCase().includes(search.toLowerCase())
    const matchDomaine = domaine.length === 0 || domaine.some(d => a.domaines.includes(d))
    const matchBadge   = badge.length === 0   || badge.includes(a.badge)
    const matchPays    = pays === 'Tous les pays' || a.pays === pays
    return matchSearch && matchDomaine && matchBadge && matchPays
  })

  return (
    <div>
      {/* Header */}
      <section className="hero-pattern py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Annuaire national
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Associations de la diaspora
          </h1>
          <p className="text-white/70 mb-8">
            {associations.length} associations vérifiées — trouvez votre partenaire solidaire
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une association, un domaine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
            />
          </div>
        </div>
      </section>

      {/* Filtres + Résultats */}
      <section className="py-10 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Barre filtres */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                showFilters || hasFilters
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {hasFilters && (
                <span className="bg-white text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {domaine.length + badge.length + (pays !== 'Tous les pays' ? 1 : 0)}
                </span>
              )}
            </button>
            <span className="text-gray-500 text-sm">{filtered.length} résultats</span>
          </div>

          {/* Panneau filtres */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="grid md:grid-cols-3 gap-8">

                {/* Domaines */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Domaines d'action</h3>
                  <div className="flex flex-wrap gap-2">
                    {DOMAINES.map(d => (
                      <button
                        key={d}
                        onClick={() => toggleDomaine(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          domaine.includes(d)
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Badge de vérification</h3>
                  <div className="flex flex-col gap-2">
                    {BADGES.map(b => (
                      <button
                        key={b}
                        onClick={() => toggleBadge(b)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left ${
                          badge.includes(b)
                            ? 'bg-green-50 border-primary text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-primary'
                        }`}
                      >
                        {BADGE_ICON[b]} {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pays */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Pays d'implantation</h3>
                  <select
                    value={pays}
                    onChange={e => setPays(e.target.value)}
                    className="w-full border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    {PAYS.map(p => <option key={p}>{p}</option>)}
                  </select>

                  {/* Reset */}
                  {hasFilters && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" /> Réinitialiser les filtres
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Grille */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Aucune association trouvée.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map(a => <AssociationCard key={a.id} asso={a} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}