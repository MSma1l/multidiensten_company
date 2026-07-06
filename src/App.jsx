import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import ScrollRestoration from './components/ScrollRestoration.jsx'
import Home from './pages/Home/Home.jsx'
import Jobs from './pages/Jobs/Jobs.jsx'
import Contact from './pages/Contact/Contact.jsx'
import LegalPage from './pages/Legal/LegalPage.jsx'

export default function App() {
  return (
    <>
      <ScrollRestoration />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<LegalPage docKey="privacy" />} />
          <Route path="/voorwaarden" element={<LegalPage docKey="terms" />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
