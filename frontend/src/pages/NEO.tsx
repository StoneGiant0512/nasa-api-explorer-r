import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FaCalendar, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'
import { neoService } from '../services/neoService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const NEO = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const { data: neoData, isLoading, error, refetch } = useQuery({
    queryKey: ['neo', startDate, endDate],
    queryFn: () => neoService.getNEOByDateRange(startDate, endDate),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  const formatDate = (dateString: string) => {
    return neoService.getFormattedDate(dateString)
  }

  const getHazardLevel = (isHazardous: boolean) => {
    return isHazardous ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
        <FaExclamationTriangle className="mr-1" />
        Potentially Hazardous
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
        <FaInfoCircle className="mr-1" />
        Safe
      </span>
    )
  }

  const getSizeCategory = (diameter: number) => {
    if (diameter > 1000) return { category: 'Large', color: 'text-red-400' }
    if (diameter > 100) return { category: 'Medium', color: 'text-yellow-400' }
    return { category: 'Small', color: 'text-green-400' }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="Failed to load NEO data" onRetry={refetch} />
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
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Near-Earth Objects
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track asteroids and comets that come close to Earth. Monitor potentially hazardous objects 
            and learn about their characteristics, orbits, and close approaches.
          </p>
        </motion.div>

        {/* Date Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaCalendar className="inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaCalendar className="inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        </motion.div>

        {/* NEO Data */}
        {neoData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {neoData.element_count}
                </div>
                <div className="text-gray-300">Total Objects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {Object.values(neoData.near_earth_objects).flat().filter((neo: any) => neo.is_potentially_hazardous_asteroid).length}
                </div>
                <div className="text-gray-300">Potentially Hazardous</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {Object.keys(neoData.near_earth_objects).length}
                </div>
                <div className="text-gray-300">Days with Objects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.max(...Object.values(neoData.near_earth_objects).map((neos: any) => neos.length))}
                </div>
                <div className="text-gray-300">Max Objects/Day</div>
              </div>
            </div>

            {/* Objects by Date */}
            <div className="space-y-8">
              {Object.entries(neoData.near_earth_objects)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, neos]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">
                        {formatDate(date)}
                      </h3>
                      <span className="text-gray-300">
                        {neos.length} object{neos.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {neos.map((neo: any) => {
                        const sizeCategory = getSizeCategory(
                          (neo.estimated_diameter.kilometers.estimated_diameter_min + 
                           neo.estimated_diameter.kilometers.estimated_diameter_max) / 2
                        )
                        
                        return (
                          <div
                            key={neo.id}
                            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-white text-lg">
                                {neo.name}
                              </h4>
                              {getHazardLevel(neo.is_potentially_hazardous_asteroid)}
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-400">Size: </span>
                                <span className={`font-medium ${sizeCategory.color}`}>
                                  {sizeCategory.category}
                                </span>
                                <span className="text-gray-300 ml-1">
                                  ({neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km)
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400">Closest Approach: </span>
                                <span className="text-white font-medium">
                                  {neo.close_approach_data[0]?.close_approach_date_full}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400">Distance: </span>
                                <span className="text-white font-medium">
                                  {parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers).toLocaleString()} km
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400">Velocity: </span>
                                <span className="text-white font-medium">
                                  {parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                                </span>
                              </div>

                              {neo.orbital_data && (
                                <div>
                                  <span className="text-gray-400">Orbit: </span>
                                  <span className="text-white font-medium">
                                    {neo.orbital_data.orbit_class?.orbit_class_type || 'Unknown'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-2xl font-bold text-purple-400 mb-4">
            About Near-Earth Objects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What are NEOs?</h4>
              <p className="leading-relaxed">
                Near-Earth Objects (NEOs) are asteroids and comets that orbit the Sun and come within 
                1.3 astronomical units (AU) of Earth. They range in size from meters to kilometers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Potentially Hazardous Asteroids</h4>
              <p className="leading-relaxed">
                PHAs are NEOs larger than 140 meters that can come within 0.05 AU of Earth. 
                While none currently pose an immediate threat, they are closely monitored.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NEO 