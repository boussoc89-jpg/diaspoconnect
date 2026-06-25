import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DOMAINES = ['Éducation', 'Santé', 'Agriculture', 'Environnement', 'Culture', 'Sport', 'Entrepreneuriat']
const PAYS = ['France', 'Italie', 'Espagne', 'Belgique', 'Allemagne', 'Royaume-Uni', 'États-Unis', 'Canada', 'Suisse', 'Portugal', 'Pays-Bas', 'Autre']
const REGIONS = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Diourbel', 'Louga', 'Fatick', 'Kolda', 'Matam', 'Tambacounda', 'Kédougou', 'Sédhiou', 'Kaffrine']

export default function InscriptionAssociation() {
  const navigate = useNavigate()
  const [etape, setEtape] = useState(1)
  const [form, setForm] = useState({
    nom: '', email: '', motDePasse: '', confirmerMotDePasse: '',
    pays: '', description: '', site_web: '', telephone: '',
    depuis: '', domaines: [], regions: []
  })
  const [fichiers, setFichiers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleDomaine = (d) =>
    setForm({ ...form, domaines: form.domaines.includes(d) ? form.domaines.filter(x => x !== d) : [...form.domaines, d] })

  const toggleRegion = (r) =>
    setForm({ ...form, regions: form.regions.includes(r) ? form.regions.filter(x => x !== r) : [...form.regions, r] })

  const handleSubmit = async () => {
    if (form.motDePasse !== form.confirmerMotDePasse) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://diaspoconnect-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom,
          email: form.email,
          motDePasse: form.motDePasse,
          role: 'association',
          pays: form.pays,
          description: form.description,
          site_web: form.site_web,
          telephone: form.telephone,
          depuis: form.depuis ? parseInt(form.depuis) : null,
          domaines: form.domaines.join(', '),
          regions: form.regions.join(', '),
        })
      })
      const data = await res.json()
      if (res.ok) {
        setEtape(4)
      } else {
        setError(data.message || 'Erreur lors de l\'inscription')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    }
    setLoading(false)
  }

  if (etape === 4) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
          <p className="text-gray-500 text-sm mb-2">Votre demande d'inscription a été soumise.</p>
          <p className="text-gray-500 text-sm mb-6">Notre équipe va examiner votre dossier et vous contacter sous 48h.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#245a42] transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      {/* Header */}
      <div className="bg-[#2d6a4f] text-white px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-green-200 text-sm mb-4 hover:text-white transition">
          ← Retour
        </button>
        <h1 className="text-3xl font-bold">Inscrire mon association</h1>
        <p className="text-green-200 text-sm mt-1">Rejoignez le réseau DiaspoConnect</p>
      </div>

      {/* Étapes */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                etape >= n ? 'bg-[#2d6a4f] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {n}
              </div>
              <span className={`text-xs font-medium ${etape >= n ? 'text-[#2d6a4f]' : 'text-gray-400'}`}>
                {n === 1 ? 'Compte' : n === 2 ? 'Association' : 'Documents'}
              </span>
              {n < 3 && <div className={`flex-1 h-0.5 ${etape > n ? 'bg-[#2d6a4f]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Étape 1 — Compte */}
        {etape === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Informations de connexion</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'association *</label>
              <input type="text" name="nom" placeholder="Ex: Teranga France" value={form.nom} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" placeholder="contact@association.fr" value={form.email} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="motDePasse" placeholder="••••••••" value={form.motDePasse} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
              <input type="password" name="confirmerMotDePasse" placeholder="••••••••" value={form.confirmerMotDePasse} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

            <button
              onClick={() => {
                if (!form.nom || !form.email || !form.motDePasse) { setError('Veuillez remplir tous les champs'); return }
                if (form.motDePasse !== form.confirmerMotDePasse) { setError('Les mots de passe ne correspondent pas'); return }
                setError(''); setEtape(2)
              }}
              className="w-full bg-[#2d6a4f] text-white py-3 rounded-xl font-semibold hover:bg-[#245a42] transition"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Étape 2 — Infos association */}
        {etape === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Informations de l'association</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays d'implantation *</label>
                <select name="pays" value={form.pays} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]">
                  <option value="">Sélectionner...</option>
                  {PAYS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année de création</label>
                <input type="number" name="depuis" placeholder="Ex: 2015" value={form.depuis} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" placeholder="Décrivez votre association, sa mission et ses activités..." value={form.description} onChange={handleChange}
                rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f] resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input type="text" name="site_web" placeholder="www.association.fr" value={form.site_web} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="text" name="telephone" placeholder="+33 6 00 00 00 00" value={form.telephone} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Domaines d'action *</label>
              <div className="flex flex-wrap gap-2">
                {DOMAINES.map(d => (
                  <button key={d} onClick={() => toggleDomaine(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      form.domaines.includes(d) ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]' : 'border-gray-200 text-gray-600'
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Régions d'intervention au Sénégal *</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r => (
                  <button key={r} onClick={() => toggleRegion(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      form.regions.includes(r) ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]' : 'border-gray-200 text-gray-600'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setEtape(1)} className="py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition">
                ← Retour
              </button>
              <button
                onClick={() => {
                  if (!form.pays || !form.description || form.domaines.length === 0) { setError('Veuillez remplir les champs obligatoires'); return }
                  setError(''); setEtape(3)
                }}
                className="py-3 rounded-xl bg-[#2d6a4f] text-white font-semibold hover:bg-[#245a42] transition"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 — Documents */}
        {etape === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Documents de vérification</h2>
            <p className="text-sm text-gray-500">Ces documents permettront à notre équipe de vérifier et valider votre association.</p>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📄</div>
              <p className="font-medium text-gray-700 text-sm mb-1">Récépissé légal de l'association</p>
              <p className="text-xs text-gray-400 mb-3">Document officiel prouvant l'existence légale de l'association</p>
              <label className="cursor-pointer border border-[#2d6a4f] text-[#2d6a4f] text-sm px-5 py-2 rounded-full hover:bg-green-50 transition inline-block">
                Choisir le fichier
                <input type="file" accept=".pdf,.jpg,.png" className="hidden"
                  onChange={(e) => setFichiers(prev => [...prev, { type: 'récépissé', file: e.target.files[0] }])} />
              </label>
              {fichiers.find(f => f.type === 'récépissé') && (
                <p className="text-xs text-green-600 mt-2">✅ {fichiers.find(f => f.type === 'récépissé').file.name}</p>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🪪</div>
              <p className="font-medium text-gray-700 text-sm mb-1">Pièce d'identité du responsable</p>
              <p className="text-xs text-gray-400 mb-3">CNI, passeport ou titre de séjour du représentant légal</p>
              <label className="cursor-pointer border border-[#2d6a4f] text-[#2d6a4f] text-sm px-5 py-2 rounded-full hover:bg-green-50 transition inline-block">
                Choisir le fichier
                <input type="file" accept=".pdf,.jpg,.png" className="hidden"
                  onChange={(e) => setFichiers(prev => [...prev, { type: 'identité', file: e.target.files[0] }])} />
              </label>
              {fichiers.find(f => f.type === 'identité') && (
                <p className="text-xs text-green-600 mt-2">✅ {fichiers.find(f => f.type === 'identité').file.name}</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              ⚠️ Les documents sont optionnels pour l'inscription mais obligatoires pour obtenir le badge <strong>Vérifiée</strong>.
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

            <div className="grid grid-cols-2 gap-4 pb-4">
              <button onClick={() => setEtape(2)} className="py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition">
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="py-3 rounded-xl bg-[#2d6a4f] text-white font-semibold hover:bg-[#245a42] transition disabled:opacity-60"
              >
                {loading ? 'Envoi...' : 'Soumettre ma demande'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}