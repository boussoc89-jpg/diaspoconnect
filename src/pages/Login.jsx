import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login, register } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState(location.state?.mode || 'login')
  const [role, setRole] = useState('porteur_projet')
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '' })
  const [fichiers, setFichiers] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await login({ email: form.email, motDePasse: form.motDePasse })
      } else {
        res = await register({ nom: form.nom, email: form.email, motDePasse: form.motDePasse, role })
      }

      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.utilisateur))
        navigate('/')
      } else {
        setError(res.message || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    }
    setLoading(false)
  }

  const roles = [
  { value: 'porteur', icon: '🌱', label: 'Porteur de projet', desc: "J'ai un besoin ou projet à financer" },
  { value: 'association', icon: '🤝', label: 'Association', desc: 'Je représente une association diaspora' },
  { value: 'visiteur', icon: '💪', label: 'Bénévole', desc: 'Je veux offrir mes compétences' },
]

  return (
    <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-[#2d6a4f] rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌍</span>
          </div>
          <span className="font-bold text-lg text-gray-900">DiaspoConnect</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'login' ? 'bg-[#2d6a4f] text-white' : 'text-gray-500'
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'register' ? 'bg-[#2d6a4f] text-white' : 'text-gray-500'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {mode === 'login' ? 'Bon retour !' : 'Rejoignez-nous'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {mode === 'login'
            ? 'Connectez-vous à votre espace DiaspoConnect'
            : 'Créez votre compte en quelques minutes'}
        </p>

        {/* Rôles (register uniquement) */}
        {mode === 'register' && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Je suis...</p>
            <div className="flex flex-col gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition ${
                    role === r.value
                      ? 'border-[#2d6a4f] bg-[#f0f7f4]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.label}</p>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nom — change selon le rôle */}
        {mode === 'register' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'association' ? "Nom de l'association" : 'Nom complet'}
            </label>
            <input
              type="text"
              name="nom"
              placeholder={role === 'association' ? 'Ex: Teranga France' : 'Ex: Amadou Diallo'}
              value={form.nom}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
          <input
            type="email"
            name="email"
            placeholder="vous@exemple.com"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="motDePasse"
              placeholder="••••••••"
              value={form.motDePasse}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {mode === 'login' && (
            <p className="text-right mt-1">
              <a href="#" className="text-[#2d6a4f] text-xs hover:underline">Mot de passe oublié ?</a>
            </p>
          )}
        </div>

        {/* Documents de vérification (association uniquement) */}
        {mode === 'register' && role === 'association' && (
          <div className="mb-4">
            <div className="border border-dashed border-gray-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">⬆️</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Documents de vérification</p>
                  <p className="text-xs text-gray-500 mt-0.5">Récépissé légal + pièce d'identité du responsable (pour badge Vérifiée)</p>
                  <label className="mt-2 inline-block cursor-pointer border border-gray-300 text-gray-600 text-xs px-4 py-1.5 rounded-full hover:bg-gray-50 transition">
                    Sélectionner les fichiers
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => setFichiers([...fichiers, ...e.target.files])}
                    />
                  </label>
                  {fichiers.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">{fichiers.length} fichier(s) sélectionné(s)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Bouton */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#2d6a4f] hover:bg-[#245a42] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 mb-4"
        >
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>

        {/* Mentions */}
        <p className="text-center text-xs text-gray-400">
          En continuant, vous acceptez nos{' '}
          <a href="#" className="text-[#2d6a4f] hover:underline">Conditions d'utilisation</a>{' '}
          et notre{' '}
          <a href="#" className="text-[#2d6a4f] hover:underline">Politique de confidentialité</a>
        </p>
      </div>
    </div>
  )
}