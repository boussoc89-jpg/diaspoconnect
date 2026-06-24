import { Users, Heart, Globe, TrendingUp, ArrowRight, MapPin, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import AssociationCard from '../components/AssociationCard'

const API_URL = 'https://diaspoconnect-backend.onrender.com/api'

export default function Home() {
  const [projets, setProjets] = useState([])
  const [associations, setAssociations] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/projets`)
      .then(r => r.json())
      .then(data => setProjets(Array.isArray(data) ? data : []))
      .catch(() => {})

    fetch(`${API_URL}/associations`)
      .then(r => r.json())
      .then(data => setAssociations(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const urgents    = projets.filter(p => p.urgent)
  const enCours    = projets.filter(p => !p.urgent && p.statut !== 'Financé')
  const certifiees = associations.filter(a => a.badge === 'Certifiée')

  return (
    <div>
      {/* Hero */}
      <section className="hero-pattern py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/30">
            🌍 La plateforme solidaire de la diaspora sénégalaise
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connecter la diaspora aux<br />besoins du Sénégal
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-2xl">
            DiaspoConnect relie les associations de la diaspora sénégalaise aux porteurs
            de projets locaux. Transparence, vérification et impact concret pour chaque soutien.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/annuaire" className="bg-accent text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2">
              Explorer l'annuaire <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/projets" className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Voir les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users,      value: `${associations.length || 0}+`, label: 'Associations' },
            { icon: Heart,      value: '4.3M €', label: 'Fonds mobilisés' },
            { icon: Globe,      value: '18',     label: 'Pays représentés' },
            { icon: TrendingUp, value: '142k+',  label: 'Bénéficiaires' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-white">
              <Icon className="w-7 h-7 text-accent mx-auto mb-2" />
              <p className="text-4xl font-bold mb-1">{value}</p>
              <p className="text-white/70 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projets urgents */}
      {urgents.length > 0 && (
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-4 py-2 rounded-full text-sm">
                ⚠ Projets urgents
              </span>
              <Link to="/projets" className="text-primary font-medium hover:underline text-sm">
                Voir tous
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {urgents.slice(0, 2).map(p => <ProjectCard key={p.id} projet={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Comment ça marche */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Comment ça marche
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-14">La solidarité en 3 étapes</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: UserCheck, step: 'ÉTAPE 01', title: 'Découvrez les associations', desc: "Consultez notre annuaire vérifié d'associations diaspora avec système de badges de confiance." },
              { icon: MapPin,    step: 'ÉTAPE 02', title: 'Explorez les projets',       desc: "Visualisez les projets sur la carte interactive du Sénégal et choisissez ceux qui vous touchent." },
              { icon: Heart,     step: 'ÉTAPE 03', title: 'Soutenez en toute confiance', desc: "Suivez l'impact de votre soutien avec notre tableau de transparence détaillé." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-accent font-semibold text-xs tracking-widest mb-2">{step}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Associations certifiées */}
      {certifiees.length > 0 && (
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Mises en avant</p>
              <Link to="/annuaire" className="text-primary text-sm font-medium hover:underline">Voir tout l'annuaire</Link>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Associations Certifiées 🥇</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {certifiees.map(a => <AssociationCard key={a.id} asso={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* Projets à soutenir */}
      {enCours.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase">En cours</p>
              <Link to="/projets" className="text-primary text-sm font-medium hover:underline">Tous les projets</Link>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Projets à soutenir</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {enCours.slice(0, 2).map(p => <ProjectCard key={p.id} projet={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}