import { useState, useEffect } from 'react'
import { getAssociations, getProjets } from '../services/api'

export default function Admin() {
  const [onglet, setOnglet] = useState('overview')
  const [associations, setAssociations] = useState([])
  const [projets, setProjets] = useState([])

  useEffect(() => {
    getAssociations().then(data => setAssociations(Array.isArray(data) ? data : []))
    getProjets().then(data => setProjets(Array.isArray(data) ? data : []))
  }, [])

  const stats = [
    { label: 'Associations', value: 247, delta: '+12 ce mois', icon: '👥', color: 'bg-green-100 text-green-700' },
    { label: 'Projets actifs', value: 5, delta: '3 en attente', icon: '📈', color: 'bg-blue-100 text-blue-700' },
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

  const validations = [
    { initiale: 'J', nom: 'Jeunesse Créative Dakar UK', pays: 'Royaume-Uni', date: '15/06/2026', docs: false, niveau: 'Membre' },
    { initiale: 'F', nom: 'Femmes Entrepreneurs Sénégal Allemagne', pays: 'Allemagne', date: '17/06/2026', docs: true, niveau: 'Vérifiée' },
  ]

  const moderationProjets = [
    { img: '📚', titre: 'Construction d\'une bibliothèque communautaire à Pikine', lieu: 'Pikine, Dakar', domaine: 'Éducation', donateurs: 187, montant: 32000, objectif: 45000, statut: null },
    { img: '💧', titre: 'Réhabilitation du forage de Dagana', lieu: 'Dagana, Saint-Louis', domaine: 'Santé', donateurs: 214, montant: 28000, objectif: 28000, statut: 'Financé' },
    { img: '🍎', titre: 'Dotation en matériel scolaire — 500 enfants de Kaolack', lieu: 'Kaolack, Kaolack', domaine: 'Éducation', donateurs: 93, montant: 8000, objectif: 13000, statut: 'URGENT', statut2: 'Actif' },
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
            { key: 'validations', label: 'Validations (2)' },
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

        {/* === VUE D'ENSEMBLE === */}
        {onglet === 'overview' && (
          <>
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
              <div className="flex items-end gap-4" style={{ height: '120px' }}>
                {mois.map((m, i) => (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full bg-yellow-400 rounded-t-md"
                      style={{ height: `${(valeurs[i] / max) * 112}px` }}
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
                        <td className="py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                            {a.nom}
                          </div>
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
                            a.badge === 'Certifiée' ? 'border-yellow-400 text-yellow-700' : 'border-blue-300 text-blue-600'
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
          </>
        )}

        {/* === VALIDATIONS === */}
        {onglet === 'validations' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-lg">⚠️</span>
              <h2 className="font-semibold text-gray-800">Demandes d'inscription en attente (2)</h2>
            </div>
            <div className="flex flex-col gap-4">
              {validations.map((v, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2d6a4f] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {v.initiale}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{v.nom}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>🌍 {v.pays}</span>
                        <span>📅 Soumis le {v.date}</span>
                        <span className={v.docs ? 'text-green-600' : 'text-orange-500'}>
                          {v.docs ? '✓ Documents fournis' : '⚠️ Documents manquants'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-[#2d6a4f] text-white text-sm px-4 py-2 rounded-full flex items-center gap-1 hover:bg-[#245a42] transition">
                      ✓ Approuver ({v.niveau})
                    </button>
                    <button className="border border-red-400 text-red-500 text-sm px-4 py-2 rounded-full flex items-center gap-1 hover:bg-red-50 transition">
                      ✕ Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === MODÉRATION PROJETS === */}
        {onglet === 'moderation' && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Projets actifs ({moderationProjets.length})</h2>
            <div className="flex flex-col gap-4">
              {moderationProjets.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {p.img}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{p.titre}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {p.lieu} • {p.domaine} • {p.donateurs} donateurs
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {p.statut === 'URGENT' && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">URGENT</span>
                          )}
                          {p.statut === 'Financé' && (
                            <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full">Financé</span>
                          )}
                          {p.statut2 && (
                            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">{p.statut2}</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold text-gray-900">{p.montant.toLocaleString()} €</span>
                          <span className="text-gray-400">{Math.round((p.montant / p.objectif) * 100)}% — objectif {p.objectif.toLocaleString()} €</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-[#2d6a4f] h-2 rounded-full"
                            style={{ width: `${Math.min((p.montant / p.objectif) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}