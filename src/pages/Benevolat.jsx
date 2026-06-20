import { Search, Plus, Code, Calculator, Megaphone, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { benevoles } from '../data/mockData'

const CATEGORIES = [
  { label: 'Développement web', icon: Code,       count: 12 },
  { label: 'Comptabilité',      icon: Calculator,  count: 8  },
  { label: 'Communication',     icon: Megaphone,   count: 15 },
  { label: 'Formation',         icon: BookOpen,    count: 9  },
]

export default function Benevolat() {
  const [search,   setSearch]   = useState('')
  const [categorie, setCategorie] = useState(null)

  const filtered = benevoles.filter(b => {
    const matchSearch = `${b.prenom} ${b.nom} ${b.competence} ${b.skills}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchCategorie = !categorie || b.competence.toLowerCase().includes(categorie.toLowerCase())
    return matchSearch && matchCategorie
  })

  return (
    <div>
      {/* Header */}
      <section className="hero-pattern py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Espace bénévolat
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Offrez vos compétences
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Soutenez des associations sans forcément donner de l'argent — votre expertise a une valeur
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une compétence ou un bénévole..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
              />
            </div>
            <button className="bg-accent text-gray-900 font-semibold px-6 py-4 rounded-2xl flex items-center gap-2 hover:bg-yellow-400 transition-colors">
              <Plus className="w-5 h-5" /> Proposer mes compétences
            </button>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          {/* Catégories cliquables */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {CATEGORIES.map(({ label, icon: Icon, count }) => (
              <div
                key={label}
                onClick={() => setCategorie(categorie === label ? null : label)}
                className={`rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                  categorie === label
                    ? 'bg-primary border-primary'
                    : 'bg-white border-transparent'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  categorie === label ? 'bg-white/20' : 'bg-green-50'
                }`}>
                  <Icon className={`w-5 h-5 ${categorie === label ? 'text-white' : 'text-primary'}`} />
                </div>
                <h3 className={`font-semibold text-sm mb-1 ${categorie === label ? 'text-white' : 'text-gray-900'}`}>
                  {label}
                </h3>
                <p className={`text-xs ${categorie === label ? 'text-white/70' : 'text-gray-400'}`}>
                  {count} bénévoles
                </p>
              </div>
            ))}
          </div>

          {/* Liste bénévoles */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Bénévoles disponibles ({filtered.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.length === 0 ? (
              <div className="text-gray-400 col-span-2 text-center py-10">
                Aucun bénévole trouvé.
              </div>
            ) : (
              filtered.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${b.couleur} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-lg">{b.initiale}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{b.prenom} {b.nom}</h3>
                          <p className="text-gray-500 text-sm mt-0.5">🌍 {b.pays}</p>
                        </div>
                        <span className="text-xs font-medium text-primary bg-green-50 px-2.5 py-1 rounded-full flex-shrink-0">
                          {b.competence}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{b.details}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-500">
                          <span className="font-medium text-gray-700">{b.skills}</span>
                          <br />Dispo: {b.dispo}
                        </div>
                        <button className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}