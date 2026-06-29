import { Search, Plus, Code, Calculator, Megaphone, BookOpen, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const API_URL = 'https://diaspoconnect-backend.onrender.com/api'

const CATEGORIES = [
  { label: 'Développement web', icon: Code },
  { label: 'Comptabilité', icon: Calculator },
  { label: 'Communication', icon: Megaphone },
  { label: 'Formation', icon: BookOpen },
]

const PAYS = ['France', 'Italie', 'Espagne', 'Belgique', 'Allemagne', 'États-Unis', 'Canada', 'Suisse', 'Autre']

export default function Benevolat() {
  const [benevoles, setBenevoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nom: '', pays: '', competence: '', skills: '', details: '', disponibilite: ''
  })
  const [formMessage, setFormMessage] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/benevoles`)
      .then(r => r.json())
      .then(data => { setBenevoles(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    if (!token) { setFormMessage('❌ Vous devez être connecté'); return }
    if (!form.nom || !form.competence) { setFormMessage('❌ Nom et compétence obligatoires'); return }
    setFormLoading(true)
    const res = await fetch(`${API_URL}/benevoles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setBenevoles([data.benevole, ...benevoles])
      setShowForm(false)
      setForm({ nom: '', pays: '', competence: '', skills: '', details: '', disponibilite: '' })
      setFormMessage('')
    } else {
      setFormMessage('❌ ' + data.message)
    }
    setFormLoading(false)
  }

  const filtered = benevoles.filter(b => {
    const matchSearch = `${b.nom} ${b.competence} ${b.skills}`
      .toLowerCase().includes(search.toLowerCase())
    const matchCategorie = !categorie || b.competence?.toLowerCase().includes(categorie.toLowerCase())
    return matchSearch && matchCategorie
  })

  const countByCategorie = (label) => benevoles.filter(b =>
    b.competence?.toLowerCase().includes(label.toLowerCase())
  ).length

  const initiale = (nom) => nom ? nom.charAt(0).toUpperCase() : '?'
  const couleurs = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500']
  const couleur = (id) => couleurs[id % couleurs.length]

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
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent text-gray-900 font-semibold px-6 py-4 rounded-2xl flex items-center gap-2 hover:bg-yellow-400 transition-colors"
            >
              <Plus className="w-5 h-5" /> Proposer mes compétences
            </button>
          </div>
        </div>
      </section>

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Proposer mes compétences</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nom complet *</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange}
                  placeholder="Ex: Amadou Diallo"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Pays</label>
                <select name="pays" value={form.pays} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2d6a4f]">
                  <option value="">Sélectionner...</option>
                  {PAYS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Domaine de compétence *</label>
                <input type="text" name="competence" value={form.competence} onChange={handleChange}
                  placeholder="Ex: Développement web, Comptabilité..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Compétences spécifiques</label>
                <input type="text" name="skills" value={form.skills} onChange={handleChange}
                  placeholder="Ex: React, Node.js, Excel..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea name="details" value={form.details} onChange={handleChange}
                  placeholder="Décrivez votre expérience et ce que vous pouvez apporter..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2d6a4f] resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Disponibilité</label>
                <input type="text" name="disponibilite" value={form.disponibilite} onChange={handleChange}
                  placeholder="Ex: Weekends, 2 jours/semaine..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>

              {formMessage && (
                <p className={`text-sm font-medium ${formMessage.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
                  {formMessage}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button onClick={() => setShowForm(false)}
                  className="py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button onClick={handleSubmit} disabled={formLoading}
                  className="py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a42] transition disabled:opacity-60">
                  {formLoading ? 'Envoi...' : 'Soumettre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu */}
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          {/* Catégories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <div
                key={label}
                onClick={() => setCategorie(categorie === label ? null : label)}
                className={`rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                  categorie === label ? 'bg-primary border-primary' : 'bg-white border-transparent'
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
                  {countByCategorie(label)} bénévoles
                </p>
              </div>
            ))}
          </div>

          {/* Liste bénévoles */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Bénévoles disponibles ({filtered.length})
          </h2>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">Aucun bénévole pour l'instant</p>
              <p className="text-sm">Soyez le premier à proposer vos compétences !</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${couleur(b.id)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-lg">{initiale(b.nom)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{b.nom}</h3>
                          {b.pays && <p className="text-gray-500 text-sm mt-0.5">🌍 {b.pays}</p>}
                        </div>
                        <span className="text-xs font-medium text-primary bg-green-50 px-2.5 py-1 rounded-full flex-shrink-0">
                          {b.competence}
                        </span>
                      </div>
                      {b.details && <p className="text-gray-600 text-sm mt-2">{b.details}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-500">
                          {b.skills && <span className="font-medium text-gray-700">{b.skills}</span>}
                          {b.disponibilite && <><br />Dispo: {b.disponibilite}</>}
                        </div>
                        <button className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}