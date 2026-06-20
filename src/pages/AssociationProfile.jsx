import { ArrowLeft, MapPin, Users, Calendar, Briefcase, Mail, Globe, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { associations, projets } from '../data/mockData'

const BADGE_STYLE = {
  Certifiée: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  Vérifiée:  'bg-green-100 text-green-800 border border-green-300',
  Membre:    'bg-orange-100 text-orange-800 border border-orange-300',
}
const BADGE_ICON = { Certifiée: '🥇', Vérifiée: '🥈', Membre: '🥉' }

export default function AssociationProfile() {
  const { id } = useParams()
  const asso   = associations.find(a => a.id === Number(id))

  if (!asso) return (
    <div className="text-center py-32 text-gray-400">
      Association introuvable.{' '}
      <Link to="/annuaire" className="text-primary underline">Retour</Link>
    </div>
  )

  const assoProjets = projets.filter(p => asso.projets.includes(p.id))

  return (
    <div>
      {/* Header */}
      <section className="hero-pattern py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/annuaire" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour à l'annuaire
          </Link>
          <div className="flex items-start gap-5">
            <img
              src={asso.image}
              alt={asso.nom}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border-2 border-white/30"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${BADGE_STYLE[asso.badge]}`}>
                  {BADGE_ICON[asso.badge]} {asso.badge}
                </span>
                <span className="text-white/60 text-sm">Depuis {asso.depuis}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mt-1">{asso.nom}</h1>
              <div className="flex items-center gap-4 mt-2 text-white/70 text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />{asso.pays}
                </span>
                <span className="text-white/40">→</span>
                <span>Sénégal : {asso.regions.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Colonne gauche */}
        <div className="md:col-span-2 space-y-6">
          {/* À propos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">À propos</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{asso.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {asso.domaines.map(d => (
                <span key={d} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{d}</span>
              ))}
            </div>
          </div>

          {/* Projets soutenus */}
          {assoProjets.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">
                Projets soutenus ({assoProjets.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {assoProjets.map(p => <ProjectCard key={p.id} projet={p} />)}
              </div>
            </div>
          )}

          {/* Tableau de transparence */}
          {assoProjets.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Tableau de transparence</h2>
              {assoProjets.map(p => {
                const pct = Math.round((p.montant_collecte / p.montant_objectif) * 100)
                return (
                  <div key={p.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{p.titre}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.statut === 'Financé' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {p.statut}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{p.montant_collecte.toLocaleString('fr-FR')} €</span>
                      <span>{pct}% — objectif {p.montant_objectif.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            {[
              { icon: Users,     value: asso.membres,          label: 'Membres' },
              { icon: Briefcase, value: asso.projets_soutenus, label: 'Projets soutenus' },
              { icon: Calendar,  value: asso.depuis,           label: 'Année de création' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            {asso.email && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                {asso.email}
              </div>
            )}
            {asso.site && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                {asso.site}
              </div>
            )}
            {asso.facebook && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-4 h-4" />
                </div>
                {asso.facebook}
              </div>
            )}
          </div>

          {/* CTA Contact */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <h3 className="font-semibold text-primary mb-1">Vous avez un projet ?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Envoyez une demande de contact à cette association. Réponse sous 48h.
            </p>
            <button className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors">
              Contacter l'association
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}