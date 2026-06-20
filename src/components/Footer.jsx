import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="hero-pattern py-20 text-center">
        <p className="text-white/60 text-sm font-semibold tracking-widest mb-4">SN</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Vous avez un projet pour le Sénégal ?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Publiez votre projet en quelques minutes et connectez-vous avec les
          associations de la diaspora prêtes à vous soutenir.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/publier"
            className="bg-accent text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2"
          >
            Publier un projet →
          </Link>
          <Link
            to="/annuaire"
            className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Inscrire mon association
          </Link>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">DiaspoConnect</span>
          </Link>
          <div className="flex items-center gap-6">
            {[
              { to: '/annuaire',  label: 'Annuaire' },
              { to: '/carte',     label: 'Carte' },
              { to: '/projets',   label: 'Projets' },
              { to: '/benevolat', label: 'Bénévolat' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="text-gray-400 hover:text-white text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          
        </div>
      </footer>
    </>
  )
}