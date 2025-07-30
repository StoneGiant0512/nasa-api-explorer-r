import React from 'react'
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

// Animation variants for different page types
const pageAnimations = {
  home: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  error: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  }
}

// Route configuration
const routes: Array<{
  path: string
  element: React.ComponentType
  animation: keyof typeof pageAnimations
}> = [
  {
    path: '/',
    element: Home,
    animation: 'home'
  },
  {
    path: '/apod',
    element: APOD,
    animation: 'page'
  },
  {
    path: '/mars-rovers',
    element: MarsRovers,
    animation: 'page'
  },
  {
    path: '/epic',
    element: EPIC,
    animation: 'page'
  },
  {
    path: '/neo',
    element: NEO,
    animation: 'page'
  },
  {
    path: '/images',
    element: ImageSearch,
    animation: 'page'
  }
]

// Animated route wrapper component
const AnimatedRoute = ({ 
  children, 
  animation = 'page' 
}: { 
  children: React.ReactNode
  animation?: keyof typeof pageAnimations 
}) => (
  <motion.div
    initial={pageAnimations[animation].initial}
    animate={pageAnimations[animation].animate}
    transition={pageAnimations[animation].transition}
  >
    {children}
  </motion.div>
)

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Routes>
          {/* Main routes */}
          {routes.map(({ path, element: Element, animation }) => (
            <Route
              key={path}
              path={path}
              element={
                <AnimatedRoute animation={animation}>
                  <Element />
                </AnimatedRoute>
              }
            />
          ))}
          
          {/* 404 route */}
          <Route
            path="*"
            element={
              <AnimatedRoute animation="error">
                <NotFound />
              </AnimatedRoute>
            }
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App 