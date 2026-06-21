import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssociations, getProjets } from '../services/api'

export default function Admin() {
  const navigate = useNavigate()
  const [onglet, setOnglet] = useState('overview')
  const [associations, setAssociations] = useState([])
  const [projets, setProjets] = useState([])

  useEffect(() => {
    getAssociations().then(data => setAssociations(Array.isArray(data) ? data : []))
    getProjets().then(data => setProjets(Array.isArray(data) ? data : []))
  }, [])

  const stats = [
    { label: 'Associations', value: associations.length || 247, delta: '+12 ce mois', icon: '👥', color: 'bg-green-100 text-green-700' },
    { label: 'Projets actifs', value: projets.length || 5, delta: '3 en attente', icon: '📈', color: 'bg-blue-100 text-blue-700' },
    { label: 'Fonds mobilisés', value: '4.3M €', delta: '+8% ce mois', icon: '🌍', color: 'bg-purple-100 text-purple-700' },
    { label: 'Certifiées', value: 3, delta: 'sur 6 total', icon: '🏅', color: 'bg-yellow-100 text-yellow-700' },
  ]

  const mockAssociations = [
    { nom: 'Sénégal Avenir France', pays: 'France', domaines: ['Éducation', 'Santé'], badge: 'Certifiée', projets: 48, fonds: '285k €' },
    { nom: 'Teranga Italia', pays: 'Italie', domaines: ['Agriculture', 'Entrepreneuriat'], badge: 'Certifiée', projets: 31, fonds: '142k €' },
    { nom: 'DiaspoSanté USA', pays: 'États-Unis', domaines: ['Santé'], badge: 'Certifiée', projets: 22, fonds: '198k €' },
    { nom: 'Sahel Vert Espagne', pays: 'Espagne', domaines: ['Environnement', 'Agriculture'], badge: 'Vérifiée', projets: 14, fonds: '68k €' },
    { nom: 'Culture Sénégal Bruxelles', pays: 'Belgique', domaines: ['Culture', 'Éducation'], badge: 'Vérifiée', projets: 19, fonds: '52k €' },
  ]

  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  const valeurs = [10, 20, 25, 30, 38, 45]
  const max = Math.max(...valeurs)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2d6a4f] text-white px-8 py-8">
        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full mb-3 inline-block">ADMIN</span>
        <h1 className="text-3xl font-bold">Administration DiaspoConnect</h1>
        <p className="text-green-200 text-sm mt-1">
          Tableau de bord — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Onglets */}
      <div className="bg-white border-b px-8">
        <div className="flex gap-6">
          {[
            { key: 'overview', label: 'Vue d\'ensemble' },
            { key: 'validations', label: 'Validations (3)' },
            { key: 'moderation', label: 'Modération projets' },
          ].map(o => (
            <button
              key={o.key}
              onClick={() => setOnglet(o.key)}
              className={`py-4 text-sm font-medium border-b-2 transition ${
                onglet === o.key
                  ? 'border-[#2d6a4f] text-[#2d6a4f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-green-600 mt-1">{s.delta}</p>
            </div>
          ))}
        </div>

        {/* Graphique */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Croissance de la plateforme — 2026</h2>
          <div className="flex items-end gap-4 h-32">
            {mois.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-yellow-400 rounded-t-md"
                  style={{ height: `${(valeurs[i] / max) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tableau associations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Associations récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-left border-b">
                  <th className="pb-3 font-medium">Association</th>
                  <th className="pb-3 font-medium">Pays</th>
                  <th className="pb-3 font-medium">Domaines</th>
                  <th className="pb-3 font-medium">Badge</th>
                  <th className="pb-3 font-medium">Projets</th>
                  <th className="pb-3 font-medium">Fonds</th>
                </tr>
              </thead>
              <tbody>
                {mockAssociations.map((a, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                      {a.nom}
                    </td>
                    <td className="py-3 text-gray-600">{a.pays}</td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {a.domaines.map(d => (
                          <span key={d} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                        a.badge === 'Certifiée'
                          ? 'border-yellow-400 text-yellow-700'
                          : 'border-blue-300 text-blue-600'
                      }`}>
                        🏅 {a.badge}
                      </span>
                    </td>
                    <td className="py-3 text-gray-700">{a.projets}</td>
                    <td className="py-3 text-green-600 font-medium">{a.fonds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}