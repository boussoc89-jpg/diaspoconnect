import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const domaines = ['Éducation', 'Santé', 'Agriculture', 'Environnement', 'Culture', 'Entrepreneuriat', 'Infrastructure']
const regions = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Diourbel', 'Louga', 'Fatick', 'Kolda', 'Matam', 'Tambacounda', 'Kédougou', 'Sédhiou', 'Kaffrine']

export default function PublierProjet() {
  const navigate = useNavigate()
  const [urgent, setUrgent] = useState(false)
  const [form, setForm] = useState({
    titre: '', description: '', domaine: '', budget: '', region: '', localite: ''
  })
  const [fichiers, setFichiers] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFichiers = (e) => setFichiers([...fichiers, ...e.target.files])

  const handleDrop = (e) => {
    e.preventDefault()
    setFichiers([...fichiers, ...e.dataTransfer.files])
  }

  const handleSubmit = async () => {
    if (!form.titre || !form.description || !form.domaine || !form.budget) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    setLoading(true)
    // Simulation envoi
    await new Promise(r => setTimeout(r, 1000))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet publié !</h2>
          <p className="text-gray-500 text-sm mb-6">Votre projet a été soumis et sera examiné par notre équipe.</p>
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
        <h1 className="text-3xl font-bold">Publier un projet</h1>
        <p className="text-green-200 text-sm mt-1">Décrivez votre besoin ou projet pour être mis en relation avec des associations</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

        {/* Projet urgent */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">⚠️</div>
            <div>
              <p className="font-semibold text-gray-900">Projet urgent</p>
              <p className="text-xs text-gray-500">Urgence sanitaire, catastrophe naturelle ou crise alimentaire</p>
            </div>
          </div>
          <button
            onClick={() => setUrgent(!urgent)}
            className={`w-12 h-6 rounded-full transition-colors relative ${urgent ? 'bg-[#2d6a4f]' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${urgent ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Informations générales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Informations générales</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du projet *</label>
            <input
              type="text"
              name="titre"
              placeholder="Ex: Construction d'une salle de classe à Thiès"
              value={form.titre}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              placeholder="Décrivez votre projet en détail : contexte, objectifs, bénéficiaires, impact attendu..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-[#2d6a4f] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domaine *</label>
              <select
                name="domaine"
                value={form.domaine}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-[#2d6a4f]"
              >
                <option value="">Sélectionner...</option>
                {domaines.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget estimé (€) *</label>
              <input
                type="number"
                name="budget"
                placeholder="Ex: 15000"
                value={form.budget}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Localisation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Région *</label>
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-[#2d6a4f]"
              >
                <option value="">Sélectionner...</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localité *</label>
              <input
                type="text"
                name="localite"
                placeholder="Ville, village ou quartier"
                value={form.localite}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>
        </div>

        {/* Photos et documents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Photos et documents</h2>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center"
          >
            <div className="text-3xl mb-2">⬆️</div>
            <p className="font-medium text-gray-700 text-sm">Glissez vos fichiers ici</p>
            <p className="text-xs text-gray-400 mt-1">Photos JPG/PNG, documents PDF (max 10 Mo chacun)</p>
            <label className="mt-4 inline-block cursor-pointer border border-[#2d6a4f] text-[#2d6a4f] text-sm px-5 py-2 rounded-full hover:bg-green-50 transition">
              Parcourir les fichiers
              <input type="file" multiple className="hidden" onChange={handleFichiers} />
            </label>
            {fichiers.length > 0 && (
              <p className="text-xs text-green-600 mt-3">{fichiers.length} fichier(s) sélectionné(s)</p>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="grid grid-cols-2 gap-4 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="py-3 rounded-xl bg-[#2d6a4f] text-white font-semibold hover:bg-[#245a42] transition disabled:opacity-60"
          >
            {loading ? 'Publication...' : 'Publier mon projet'}
          </button>
        </div>
      </div>
    </div>
  )
}