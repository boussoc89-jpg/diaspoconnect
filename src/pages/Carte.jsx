import { MapPin, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'https://diaspoconnect-backend.onrender.com/api'

const REGIONS_COORDS = {
  'Dakar':        [14.6937, -17.4441],
  'Thiès':        [14.7910, -16.9359],
  'Saint-Louis':  [16.0179, -16.4896],
  'Ziguinchor':   [12.5600, -16.2719],
  'Kaolack':      [14.1520, -16.0726],
  'Diourbel':     [14.6560, -16.2290],
  'Louga':        [15.6170, -16.2240],
  'Fatick':       [14.3390, -16.4110],
  'Kolda':        [12.8980, -14.9410],
  'Matam':        [15.6560, -13.2550],
  'Tambacounda':  [13.7710, -13.6670],
  'Kédougou':     [12.5560, -12.1750],
  'Sédhiou':      [12.7080, -15.5570],
  'Kaffrine':     [14.1050, -15.5510],
}

export default function Carte() {
  const [selected, setSelected] = useState(null)
  const [projets, setProjets] = useState([])
  const [MapComponents, setMapComponents] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/projets`)
      .then(r => r.json())
      .then(data => setProjets(Array.isArray(data) ? data : []))
      .catch(() => {})

    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([rl, L]) => {
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setMapComponents({
        MapContainer:  rl.MapContainer,
        TileLayer:     rl.TileLayer,
        CircleMarker:  rl.CircleMarker,
        Popup:         rl.Popup,
      })
    })
  }, [])

  // Calculer les stats par région depuis les vrais projets
  const regionsData = Object.entries(REGIONS_COORDS).map(([nom, coords]) => {
    const regionProjets = projets.filter(p => p.region === nom)
    const collecte = regionProjets.reduce((sum, p) => sum + parseFloat(p.montant_collecte || 0), 0)
    const objectif = regionProjets.reduce((sum, p) => sum + parseFloat(p.montant_objectif || 0), 0)
    const urgent = regionProjets.some(p => p.urgent)
    return { nom, coords, projets: regionProjets.length, collecte, objectif, urgent }
  }).filter(r => r.projets > 0)

  const regionProjets = selected
    ? projets.filter(p => p.region === selected)
    : []

  return (
    <div>
      <section className="hero-pattern py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Carte interactive
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Projets au Sénégal
          </h1>
          <p className="text-white/70">
            Cliquez sur une région pour explorer les projets actifs
          </p>
        </div>
      </section>

      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Carte Leaflet */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-600">
                  Sénégal — {regionsData.length} région(s) avec des projets
                </p>
              </div>
              <div style={{ height: '480px' }}>
                {MapComponents ? (
                  <MapComponents.MapContainer
                    center={[14.5, -14.5]}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <MapComponents.TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    {regionsData.map(r => (
                      <MapComponents.CircleMarker
                        key={r.nom}
                        center={r.coords}
                        radius={18}
                        pathOptions={{
                          fillColor: r.urgent ? '#EF4444' : '#1A7A4A',
                          color: '#fff',
                          weight: 2,
                          fillOpacity: 0.9,
                        }}
                        eventHandlers={{ click: () => setSelected(r.nom) }}
                      >
                        <MapComponents.Popup>
                          <div className="text-sm">
                            <p className="font-bold">{r.nom}</p>
                            <p>{r.projets} projet(s)</p>
                            <p>{r.collecte.toLocaleString('fr-FR')} € / {r.objectif.toLocaleString('fr-FR')} €</p>
                          </div>
                        </MapComponents.Popup>
                      </MapComponents.CircleMarker>
                    ))}
                  </MapComponents.MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Chargement de la carte...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des régions */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 mb-2">Projets par région</h2>
            {regionsData.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
                Aucun projet publié pour l'instant
              </div>
            ) : (
              regionsData.map(r => {
                const pct = r.objectif > 0 ? Math.round((r.collecte / r.objectif) * 100) : 0
                return (
                  <button
                    key={r.nom}
                    onClick={() => setSelected(selected === r.nom ? null : r.nom)}
                    className={`w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border-2 ${
                      selected === r.nom ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 text-sm">{r.nom}</span>
                        {r.urgent && (
                          <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                            <AlertTriangle className="w-3 h-3" /> URGENT
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-xs">{r.projets} projet(s)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{r.collecte.toLocaleString('fr-FR')} € collectés</span>
                      <span>/ {r.objectif.toLocaleString('fr-FR')} €</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Projets de la région sélectionnée */}
        {selected && regionProjets.length > 0 && (
          <div className="max-w-7xl mx-auto mt-8">
            <h2 className="font-semibold text-gray-900 mb-4">
              Projets actifs — {selected}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {regionProjets.map(p => {
                const montantCollecte = parseFloat(p.montant_collecte) || 0
                const montantObjectif = parseFloat(p.montant_objectif) || 1
                const pct = Math.round((montantCollecte / montantObjectif) * 100)
                return (
                  <Link to={`/projets/${p.id}`} key={p.id} className="block">
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{p.titre}</h3>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-primary font-bold">
                          {montantCollecte.toLocaleString('fr-FR')} €
                        </span>
                        <span className="text-gray-500">
                          {pct}% — objectif {montantObjectif.toLocaleString('fr-FR')} €
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <p className="text-gray-500 text-sm">{p.domaine} • {p.localite}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}