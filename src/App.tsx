import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GalleryPage from './pages/GalleryPage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import SubmitPage from './pages/SubmitPage'
import SmoothScroll from './components/SmoothScroll'
import { AppProvider } from './context/AppContext'
import GrainOverlay from './components/GrainOverlay'

function App() {
  return (
    <AppProvider>
      <Router>
        <GrainOverlay />
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/submit" element={<SubmitPage />} />
          </Routes>
        </SmoothScroll>
      </Router>
    </AppProvider>
  )
}

export default App
