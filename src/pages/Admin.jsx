import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://diaspoconnect-backend.onrender.com/api'

export default function Admin() {
  const navigate = useNavigate()
  const [onglet, setOnglet] = useState('overview')
  const [associations, setAssociations] = useState([])
  const [projets, setProjets] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API_URL}/associations`).then(r => r.json()),
      fetch(`${API_URL}/projets`).then(r => r.json()),
      fetch(`${API_URL}/associations/pending`, { headers }).then(r => r.json()),
    ]).then(([assocs, projs, pend]) => {
      setAssociations(Array.isArray(assocs) ? assocs : [])
      setProjets(Array.isArray(projs) ? projs : [])
      setPending(Array.isArray(pend) ? pend : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleApprouver = async (id) => {
    const res = await fetch(`${API_URL}/associations/${id}/approuver`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setPending(pending.filter(a => a.id !== id))
      alert('✅ Association approuvée !')
    }
  }

  const handleRejeter = async (id) => {
    const res = await fetch(`${API_URL}/associations/${id}/rejeter`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setPending(pending.filter(a => a.id !== id))
      alert('❌ Association rejetée')
    }
  }

  const handleSupprimerProjet = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return
    const res = await fetch(`${API_URL}/projets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) setProjets(projets.filter(p => p.id !== id))
  }

  const certifiees = associations.filter(a => a.badge === 'Certifiée')
  const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  const valeurs = [10, 20, 25, 30, 38, associations.length || 45]
  const max = Math.max(...valeurs)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement...</div>

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
            { key: 'validations', label: `Validations (${pending.length})` },
            { key: 'moderation', label: `Modération projets (${projets.length})` },
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Associations', value: associations.length, delta: 'actives', icon: '👥', color: 'bg-green-100 text-green-700' },
                { label: 'Projets', value: projets.length, delta: 'publiés', icon: '📈', color: 'bg-blue-100 text-blue-700' },
                { label: 'En attente', value: pending.length, delta: 'à valider', icon: '⏳', color: 'bg-orange-100 text-orange-700' },
                { label: 'Certifiées', value: certifiees.length, delta: 'associations', icon: '🏅', color: 'bg-yellow-100 text-yellow-700' },
              ].map((s, i) => (
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
                    <div className="w-full bg-yellow-400 rounded-t-md" style={{ height: `${(valeurs[i] / max) * 112}px` }} />
                    <span className="text-xs text-gray-500">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau associations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Associations actives ({associations.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-left border-b">
                      <th className="pb-3 font-medium">Association</th>
                      <th className="pb-3 font-medium">Pays</th>
                      <th className="pb-3 font-medium">Domaines</th>
                      <th className="pb-3 font-medium">Badge</th>
                      <th className="pb-3 font-medium">Depuis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {associations.map((a, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#2d6a4f] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {a.nom?.charAt(0)}
                            </div>
                            {a.nom}
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">{a.pays}</td>
                        <td className="py-3">
                          <div className="flex gap-1 flex-wrap">
                            {a.domaines && a.domaines.split(',').map(d => (
                              <span key={d} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{d.trim()}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-xs px-2 py-1 rounded-full border font-medium border-yellow-400 text-yellow-700">
                            🏅 {a.badge}
                          </span>
                        </td>
                        <td className="py-3 text-gray-700">{a.depuis || '-'}</td>
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
      <h2 className="font-semibold text-gray-800">
        Demandes d'inscription en attente ({pending.length})
      </h2>
    </div>
    {pending.length === 0 ? (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm text-gray-400">
        Aucune demande en attente
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {pending.map((v, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2d6a4f] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {v.nom?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{v.nom}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>🌍 {v.pays || 'Pays non renseigné'}</span>
                    <span>📧 {v.email_public || 'Email non renseigné'}</span>
                    {v.depuis && <span>📅 Depuis {v.depuis}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Détails du dossier */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              {v.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-gray-700">{v.description}</p>
                </div>
              )}
              {v.domaines && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Domaines d'action</p>
                  <div className="flex flex-wrap gap-1">
                    {v.domaines.split(',').map(d => (
                      <span key={d} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{d.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {v.regions && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Régions d'intervention</p>
                  <div className="flex flex-wrap gap-1">
                    {v.regions.split(',').map(r => (
                      <span key={r} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{r.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {v.site_web && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Site web</p>
                    <p className="text-gray-700">{v.site_web}</p>
                  </div>
                )}
                {v.telephone && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Téléphone</p>
                    <p className="text-gray-700">{v.telephone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprouver(v.id)}
                className="flex-1 bg-[#2d6a4f] text-white text-sm px-4 py-2 rounded-full hover:bg-[#245a42] transition"
              >
                ✓ Approuver
              </button>
              <button
                onClick={() => handleRejeter(v.id)}
                className="flex-1 border border-red-400 text-red-500 text-sm px-4 py-2 rounded-full hover:bg-red-50 transition"
              >
                ✕ Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
        {/* === MODÉRATION PROJETS === */}
        {onglet === 'moderation' && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Tous les projets ({projets.length})</h2>
            <div className="flex flex-col gap-4">
              {projets.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {p.urgent && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">URGENT</span>}
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{p.statut}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{p.domaine}</span>
                      </div>
                      <p className="font-semibold text-gray-900">{p.titre}</p>
                      <p className="text-xs text-gray-500 mt-1">{p.localite}, {p.region}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold text-[#2d6a4f]">{parseFloat(p.montant_collecte || 0).toLocaleString()} €</span>
                          <span className="text-gray-400">objectif {parseFloat(p.montant_objectif || 0).toLocaleString()} €</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-[#2d6a4f] h-1.5 rounded-full"
                            style={{ width: `${Math.min((p.montant_collecte / p.montant_objectif) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSupprimerProjet(p.id)}
                      className="ml-4 border border-red-300 text-red-500 text-xs px-3 py-1.5 rounded-full hover:bg-red-50 transition"
                    >
                      Supprimer
                    </button>
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