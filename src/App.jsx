import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Annuaire from './pages/Annuaire'
import AssociationProfile from './pages/AssociationProfile'
import Carte from './pages/Carte'
import Projets from './pages/Projets'
import Benevolat from './pages/Benevolat'
import Login from './pages/Login'
import Admin from './pages/Admin'
import PublierProjet from './pages/PublierProjet'
import Dashboard from './pages/Dashboard'
import InscriptionAssociation from './pages/InscriptionAssociation'
import ProjetDetail from './pages/ProjetDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"                      element={<Home />} />
            <Route path="/annuaire"              element={<Annuaire />} />
            <Route path="/annuaire/:id"          element={<AssociationProfile />} />
            <Route path="/carte"                 element={<Carte />} />
            <Route path="/projets"               element={<Projets />} />
            <Route path="/benevolat"             element={<Benevolat />} />
            <Route path="/login"                 element={<Login />} />
            <Route path="/admin"                 element={<Admin />} />
            <Route path="/publier"               element={<PublierProjet />} />
            <Route path="/dashboard"             element={<Dashboard />} />
            <Route path="/projets/:id"           element={<ProjetDetail />} />
            <Route path="/inscrire-association"  element={<InscriptionAssociation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}