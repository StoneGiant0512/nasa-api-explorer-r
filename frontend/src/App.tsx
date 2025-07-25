import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import APOD from './pages/APOD'
import MarsRovers from './pages/MarsRovers'
import EPIC from './pages/EPIC'
import NEO from './pages/NEO'
import ImageSearch from './pages/ImageSearch'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Home />
              </motion.div>
            } 
          />
          <Route 
            path="/apod" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <APOD />
              </motion.div>
            } 
          />
          <Route 
            path="/mars-rovers" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MarsRovers />
              </motion.div>
            } 
          />
          <Route 
            path="/epic" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EPIC />
              </motion.div>
            } 
          />
          <Route 
            path="/neo" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <NEO />
              </motion.div>
            } 
          />
          <Route 
            path="/images" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ImageSearch />
              </motion.div>
            } 
          />
          <Route 
            path="*" 
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <NotFound />
              </motion.div>
            } 
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App 