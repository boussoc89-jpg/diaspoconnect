import { MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const BADGE_STYLE = {
  Certifiée: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  Vérifiée:  'bg-green-100 text-green-800 border border-green-300',
  Membre:    'bg-orange-100 text-orange-800 border border-orange-300',
}
const BADGE_ICON = {
  Certifiée: '🥇',
  Vérifiée:  '🥈',
  Membre:    '🥉',
}
const DOMAIN_COLORS = {
  Éducation:      'bg-blue-100 text-blue-700',
  Santé:          'bg-red-100 text-red-700',
  Agriculture:    'bg-green-100 text-green-700',
  Environnement:  'bg-teal-100 text-teal-700',
  Culture:        'bg-purple-100 text-purple-700',
  Sport:          'bg-orange-100 text-orange-700',
  Entrepreneuriat:'bg-yellow-100 text-yellow-700',
}

export default function AssociationCard({ asso }) {
  const domainesArray = asso.domaines && typeof asso.domaines === 'string'
    ? asso.domaines.split(',').map(d => d.trim())
    : Array.isArray(asso.domaines) ? asso.domaines : []

  const initiale = asso.nom ? asso.nom.charAt(0).toUpperCase() : '?'

  return (
    <Link to={`/annuaire/${asso.id}`}>
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start gap-3 mb-3">
          {asso.logo ? (
            <img
              src={asso.logo}
              alt={asso.nom}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#2d6a4f] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{initiale}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{asso.nom}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {asso.pays}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{asso.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {domainesArray.map(d => (
            <span
              key={d}
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${DOMAIN_COLORS[d] || 'bg-gray-100 text-gray-700'}`}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${BADGE_STYLE[asso.badge] || 'bg-gray-100 text-gray-700'}`}>
            {BADGE_ICON[asso.badge] || '🥉'} {asso.badge || 'Membre'}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {asso.depuis ? `Depuis ${asso.depuis}` : 'Nouvelle'}
          </span>
        </div>
      </div>
    </Link>
  )
}