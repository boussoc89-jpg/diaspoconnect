import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import AssociationCard from '../components/AssociationCard'
import { associations } from '../data/mockData'

const DOMAINES = ['Tous', 'Éducation', 'Santé', 'Agriculture', 'Entrepreneuriat', 'Environnement', 'Culture', 'Sport']
const BADGES   = ['Tous', 'Certifiée', 'Vérifiée', 'Membre']

export default function Annuaire() {
  const [search,  setSearch]  = useState('')
  const [domaine, setDomaine] = useState('Tous')
  const [badge,   setBadge]   = useState('Tous')

  const filtered = associations.filter(a => {
    const matchSearch  = a.nom.toLowerCase().includes(search.toLowerCase()) ||
                         a.description.toLowerCase().includes(search.toLowerCase())
    const matchDomaine = domaine === 'Tous' || a.domaines.includes(domaine)
    const matchBadge   = badge === 'Tous'   || a.badge === badge
    return matchSearch && matchDomaine && matchBadge
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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
                <SlidersHorizontal className="w-4 h-4" /> Filtres
              </button>
              {DOMAINES.slice(1).map(d => (
                <button
                  key={d}
                  onClick={() => setDomaine(domaine === d ? 'Tous' : d)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    domaine === d
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <span className="text-gray-500 text-sm">{filtered.length} résultats</span>
          </div>

          {/* Filtres badges */}
          <div className="flex gap-2 mb-8">
            {BADGES.map(b => (
              <button
                key={b}
                onClick={() => setBadge(b)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  badge === b
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

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