import { MapPin, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { regionsData, projets } from '../data/mockData'

export default function Carte() {
  const [selected, setSelected] = useState(null)
  const [MapComponents, setMapComponents] = useState(null)

  useEffect(() => {
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

  const regionProjets = selected
    ? projets.filter(p => p.region === selected)
    : []

  return (
    <div>
      {/* Header */}
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

      {/* Carte + Liste */}
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Carte Leaflet */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-600">Sénégal — 14 régions</p>
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
            {regionsData.map(r => {
              const pct = Math.round((r.collecte / r.objectif) * 100)
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
                    <span className="text-gray-400 text-xs">{r.projets} projet</span>
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
            })}
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
                const pct = Math.round((p.montant_collecte / p.montant_objectif) * 100)
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">{p.titre}</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary font-bold">
                        {p.montant_collecte.toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-gray-500">
                        {pct}% — objectif {p.montant_objectif.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-sm">{p.donateurs} donateurs</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}