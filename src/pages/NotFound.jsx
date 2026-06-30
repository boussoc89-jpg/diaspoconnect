import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-[#2d6a4f] mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#245a42] transition"
          >
            <Home className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <Link
            to="/projets"
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            <Search className="w-4 h-4" /> Voir les projets
          </Link>
        </div>
      </div>
    </div>
  )
}