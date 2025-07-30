import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FaGlobe, FaCalendar, FaExternalLinkAlt } from 'react-icons/fa'
import { epicService } from '../services/epicService'
import { EPICResponse } from '../types/nasa'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const EPIC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const { data: epicData, isLoading, error, refetch } = useQuery({
    queryKey: ['epic', selectedDate],
    queryFn: () => epicService.getEPICByDate(selectedDate),
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const formatDate = (dateString: string) => {
    return epicService.getFormattedDate(dateString)
  }

  const formatTime = (dateString: string) => {
    return epicService.getFormattedTime(dateString)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="Failed to load EPIC data" onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              EPIC Earth Images
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            View our beautiful planet from space! EPIC (Earth Polychromatic Imaging Camera) 
            aboard the DSCOVR satellite captures stunning images of Earth from 1 million miles away.
          </p>
        </motion.div>

        {/* Date Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <FaCalendar className="text-green-400 text-xl" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="text-gray-300">
                {formatDate(selectedDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <FaGlobe className="text-xl" />
              <span className="font-medium">DSCOVR Satellite</span>
            </div>
          </div>
        </motion.div>

        {/* EPIC Images */}
        {epicData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {epicData.length === 0 ? (
              <div className="text-center py-12">
                <FaGlobe className="text-6xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No images found for this date
                </h3>
                <p className="text-gray-400">
                  EPIC images are typically available from June 2015 onwards. Try selecting a different date.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Earth Images from DSCOVR
                  </h2>
                  <p className="text-gray-300">
                    {epicData.length} image{epicData.length !== 1 ? 's' : ''} captured on {formatDate(selectedDate)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {epicData.map((image: EPICResponse, index: number) => (
                    <motion.div
                      key={image.identifier}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square">
                          <img
                            src={`https://epic.gsfc.nasa.gov/archive/natural/${selectedDate.split('-')[0]}/${selectedDate.split('-')[1].padStart(2, '0')}/${selectedDate.split('-')[2].padStart(2, '0')}/png/${image.image}.png`}
                            alt={`Earth image ${image.identifier}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <a
                              href={`https://epic.gsfc.nasa.gov/archive/natural/${selectedDate.split('-')[0]}/${selectedDate.split('-')[1].padStart(2, '0')}/${selectedDate.split('-')[2].padStart(2, '0')}/png/${image.image}.png`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/30 transition-colors duration-200"
                            >
                              <FaExternalLinkAlt size={16} />
                              <span>View Full Size</span>
                            </a>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2">
                            {image.caption}
                          </h3>
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>
                              <span className="text-gray-400">Time: </span>
                              {formatTime(image.date)}
                            </p>
                            <p>
                              <span className="text-gray-400">Distance: </span>
                              {image.centroid_coordinates.lat.toFixed(2)}°N, {image.centroid_coordinates.lon.toFixed(2)}°E
                            </p>
                            <p>
                              <span className="text-gray-400">DSCOVR Distance: </span>
                              {image.dscovr_j2000_position.x.toFixed(0)} km
                            </p>
                            <p>
                              <span className="text-gray-400">Sun Distance: </span>
                              {image.sun_j2000_position.x.toFixed(0)} km
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-2xl font-bold text-green-400 mb-4">
            About EPIC
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">DSCOVR Mission</h4>
              <p className="leading-relaxed">
                The Deep Space Climate Observatory (DSCOVR) is a NOAA space weather satellite that orbits 
                at the L1 point between Earth and the Sun, approximately 1 million miles from Earth.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">EPIC Camera</h4>
              <p className="leading-relaxed">
                The Earth Polychromatic Imaging Camera (EPIC) captures images of Earth in 10 different 
                wavelengths, providing valuable data for climate research and atmospheric studies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EPIC 