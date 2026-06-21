import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../services/api'

const navLinks = [
  { to: '/annuaire',  label: 'Annuaire' },
  { to: '/carte',     label: 'Carte' },
  { to: '/projets',   label: 'Projets' },
  { to: '/benevolat', label: 'Bénévolat' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const user = getUser()

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
    window.location.reload()
  }

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

          {/* Bouton Connexion avec dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 hover:bg-primary-dark transition-colors"
            >
              {user ? user.nom : 'Connexion'}
              <ChevronDown className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => { setOpen(false) }}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Créer un compte
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#2d6a4f] hover:bg-gray-50"
                    >
                      Admin (démo)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50"
                    >
                      Se déconnecter
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}