import { Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const DOMAIN_COLORS = {
  Éducation:      'bg-blue-500',
  Santé:          'bg-red-500',
  Agriculture:    'bg-green-600',
  Environnement:  'bg-teal-500',
  Culture:        'bg-purple-500',
  Sport:          'bg-orange-500',
  Entrepreneuriat:'bg-yellow-600',
}

const DOMAIN_EMOJIS = {
  Éducation:      '📚',
  Santé:          '🏥',
  Agriculture:    '🌾',
  Environnement:  '🌿',
  Culture:        '🎭',
  Sport:          '⚽',
  Entrepreneuriat:'💼',
}

export default function ProjectCard({ projet }) {
  const montantCollecte = parseFloat(projet.montant_collecte) || 0
  const montantObjectif = parseFloat(projet.montant_objectif) || 1
  const pct = Math.round((montantCollecte / montantObjectif) * 100)
  const domainColor = DOMAIN_COLORS[projet.domaine] || 'bg-gray-500'

  return (
    <Link to={`/projets/${projet.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* Image ou placeholder */}
        <div className="relative h-48">
          {projet.image ? (
            <img src={projet.image} alt={projet.titre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">
              {DOMAIN_EMOJIS[projet.domaine] || '📋'}
            </div>
          )}
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
          {projet.localite && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs bg-black/40 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              {projet.localite}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{projet.titre}</h3>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-primary font-bold text-base">
              {montantCollecte.toLocaleString('fr-FR')} €
            </span>
            <span className="text-gray-500">
              {pct}% — objectif {montantObjectif.toLocaleString('fr-FR')} €
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {projet.donateurs ? `${projet.donateurs} donateurs` : 'Nouveau projet'}
            </span>
            {projet.jours_restants && (
              <span className="text-red-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {projet.jours_restants}j restants
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}