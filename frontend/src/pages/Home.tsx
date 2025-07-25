import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaRocket, 
  FaCamera, 
  FaSatellite, 
  FaSearch, 
  FaGlobe, 
  FaAsterisk 
} from 'react-icons/fa'

const Home = () => {
  const features = [
    {
      icon: <FaCamera className="text-4xl text-blue-400" />,
      title: 'Astronomy Picture of the Day',
      description: 'Discover stunning daily images from space with detailed explanations from NASA astronomers.',
      path: '/apod',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaRocket className="text-4xl text-red-400" />,
      title: 'Mars Rover Photos',
      description: 'Explore the Red Planet through the eyes of NASA\'s Mars rovers with high-resolution images.',
      path: '/mars-rovers',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: <FaGlobe className="text-4xl text-green-400" />,
      title: 'EPIC Earth Images',
      description: 'View our beautiful planet from space with daily Earth images from the DSCOVR satellite.',
      path: '/epic',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaAsterisk className="text-4xl text-purple-400" />,
      title: 'Near-Earth Objects',
      description: 'Track asteroids and comets that come close to Earth with real-time data from NASA.',
      path: '/neo',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaSearch className="text-4xl text-yellow-400" />,
      title: 'NASA Image Search',
      description: 'Search through NASA\'s vast collection of images, videos, and audio files.',
      path: '/images',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <FaSatellite className="text-4xl text-indigo-400" />,
      title: 'Space Missions',
      description: 'Stay updated with the latest space missions and discoveries from NASA.',
      path: '/apod',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaRocket className="text-6xl text-blue-400" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NASA Explorer
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Embark on a journey through the cosmos with NASA's vast collection of astronomical data, 
              stunning images, and groundbreaking discoveries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apod"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Exploring
              </Link>
              <a
                href="https://api.nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-400 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                NASA API
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore the Universe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing features that bring NASA's space data to life with beautiful visualizations and interactive experiences.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={feature.path}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full border border-gray-200 hover:border-gray-300">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 mb-4 group-hover:scale-110 transition-transform duration-200">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className={`mt-4 w-full h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              NASA's Data Universe
            </h2>
            <p className="text-xl text-gray-300">
              Access to millions of images, videos, and data points from space exploration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '140K+', label: 'Images Available' },
              { number: '50+', label: 'Space Missions' },
              { number: '25+', label: 'Years of Data' },
              { number: '100%', label: 'Free Access' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 