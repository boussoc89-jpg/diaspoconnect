import { Globe, ChevronDown } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/annuaire',  label: 'Annuaire' },
  { to: '/carte',     label: 'Carte' },
  { to: '/projets',   label: 'Projets' },
  { to: '/benevolat', label: 'Bénévolat' },
]

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">DiaspoConnect</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/publier"
            className="border border-primary text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Publier un projet
          </Link>
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 hover:bg-primary-dark transition-colors">
            Connexion
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}