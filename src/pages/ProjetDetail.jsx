import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react'

const API_URL = 'https://diaspoconnect-backend.onrender.com/api'

const DOMAIN_COLORS = {
  Éducation: 'bg-blue-500',
  Santé: 'bg-red-500',
  Agriculture: 'bg-green-600',
  Environnement: 'bg-teal-500',
  Culture: 'bg-purple-500',
  Sport: 'bg-orange-500',
  Entrepreneuriat: 'bg-yellow-600',
}

export default function ProjetDetail() {
  const { id } = useParams()
  const [projet, setProjet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/projets/${id}`)
      .then(r => r.json())
      .then(data => { setProjet(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-32 text-gray-400">Chargement...</div>

  if (!projet || projet.message) return (
    <div className="text-center py-32 text-gray-400">
      Projet introuvable.{' '}
      <Link to="/projets" className="text-primary underline">Retour</Link>
    </div>
  )

  const montantCollecte = parseFloat(projet.montant_collecte) || 0
  const montantObjectif = parseFloat(projet.montant_objectif) || 1
  const pct = Math.round((montantCollecte / montantObjectif) * 100)
  const domainColor = DOMAIN_COLORS[projet.domaine] || 'bg-gray-500'

  return (
    <div>
      {/* Header */}
      <section className="hero-pattern py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/projets" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour aux projets
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${domainColor}`}>
              {projet.domaine}
            </span>
            {projet.urgent && (
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                ⚠ URGENT
              </span>
            )}
            {projet.statut === 'Financé' && (
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                ✓ Financé
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{projet.titre}</h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {projet.localite}, {projet.region}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Colonne gauche */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Description du projet</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {projet.description || 'Aucune description disponible.'}
            </p>
          </div>

          {/* Progression */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Avancement du financement</h2>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-[#2d6a4f]">
                {montantCollecte.toLocaleString('fr-FR')} €
              </span>
              <span className="text-gray-500 text-sm">
                objectif {montantObjectif.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
              <div
                className="bg-[#2d6a4f] h-3 rounded-full transition-all"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2d6a4f] font-semibold">{pct}% atteint</span>
              <span className="text-gray-500">
                {(montantObjectif - montantCollecte).toLocaleString('fr-FR')} € restants
              </span>
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-5">
          {/* Infos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Informations</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#2d6a4f]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{projet.localite}</p>
                <p className="text-xs text-gray-500">{projet.region}, Sénégal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-[#2d6a4f]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{projet.statut}</p>
                <p className="text-xs text-gray-500">Statut du projet</p>
              </div>
            </div>
            {projet.jours_restants && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{projet.jours_restants} jours</p>
                  <p className="text-xs text-gray-500">Restants</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <h3 className="font-semibold text-primary mb-1">Soutenir ce projet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Contactez le porteur de projet pour apporter votre soutien.
            </p>
            <Link
              to="/annuaire"
              className="block w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors text-center"
            >
              Voir les associations
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}