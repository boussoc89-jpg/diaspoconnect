import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://diaspoconnect-backend.onrender.com/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [projets, setProjets] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/projets/mes-projets`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setProjets(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/projets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setProjets(projets.filter(p => p.id !== id))
    } else {
      alert('Erreur lors de la suppression')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2d6a4f] text-white px-8 py-8">
        <p className="text-green-200 text-sm mb-1">MON ESPACE</p>
        <h1 className="text-3xl font-bold">Mes projets</h1>
        <p className="text-green-200 text-sm mt-1">Bonjour {user.nom} — gérez vos projets publiés</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Bouton publier */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-sm">{projets.length} projet(s) publié(s)</p>
          <button
            onClick={() => navigate('/publier')}
            className="bg-[#2d6a4f] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#245a42] transition"
          >
            + Nouveau projet
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement...</div>
        ) : projets.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet publié</h2>
            <p className="text-gray-500 text-sm mb-6">Publiez votre premier projet pour être mis en relation avec des associations.</p>
            <button
              onClick={() => navigate('/publier')}
              className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#245a42] transition"
            >
              Publier un projet
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projets.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {p.urgent && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">URGENT</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.statut === 'Financé' ? 'bg-green-100 text-green-700' :
                        p.statut === 'En cours' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {p.statut}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{p.titre}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {p.domaine} • {p.localite}, {p.region}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#2d6a4f] font-bold">
                        {parseFloat(p.montant_collecte || 0).toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-gray-400">
                        / {parseFloat(p.montant_objectif || 0).toLocaleString('fr-FR')} € objectif
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-[#2d6a4f] h-1.5 rounded-full"
                        style={{ width: `${Math.min((p.montant_collecte / p.montant_objectif) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="border border-red-300 text-red-500 text-xs px-3 py-1.5 rounded-full hover:bg-red-50 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
