import { Clock, MapPin } from 'lucide-react'

const DOMAIN_COLORS = {
  Éducation:      'bg-blue-500',
  Santé:          'bg-red-500',
  Agriculture:    'bg-green-600',
  Environnement:  'bg-teal-500',
  Culture:        'bg-purple-500',
  Sport:          'bg-orange-500',
  Entrepreneuriat:'bg-yellow-600',
}

export default function ProjectCard({ projet }) {
  const pct = Math.round((projet.montant_collecte / projet.montant_objectif) * 100)
  const domainColor = DOMAIN_COLORS[projet.domaine] || 'bg-gray-500'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={projet.image}
          alt={projet.titre}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${domainColor}`}>
            {projet.domaine}
          </span>
          {projet.urgent && (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              ⚠ URGENT
            </span>
          )}
          {projet.statut === 'Financé' && (
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Financé
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
          <MapPin className="w-3 h-3" />
          {projet.localite}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{projet.titre}</h3>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-primary font-bold text-base">
            {projet.montant_collecte.toLocaleString('fr-FR')} €
          </span>
          <span className="text-gray-500">
            {pct}% — objectif {projet.montant_objectif.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{projet.donateurs} donateurs</span>
          {projet.jours_restants && (
            <span className="text-red-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {projet.jours_restants}j restants
            </span>
          )}
        </div>
      </div>
    </div>
  )
}