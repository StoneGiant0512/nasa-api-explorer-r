import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FaCalendar, FaExternalLinkAlt, FaPlay, FaPause } from 'react-icons/fa'
import { apodService } from '../services/apodService'
import { APODResponse } from '../types/nasa'

import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const APOD = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Use yesterday's date instead of today to ensure data is available
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  })
  const [isPlaying, setIsPlaying] = useState(false)

  const { data: apodData, isLoading, error, refetch } = useQuery({
    queryKey: ['apod', selectedDate],
    queryFn: () => apodService.getAPODByDate(selectedDate),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
  
  // Handle both single object and array responses with null safety
  const apod: APODResponse | undefined = Array.isArray(apodData) && apodData.length > 0 ? apodData[0] : (apodData as APODResponse)

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleRandomDate = () => {
    setSelectedDate(apodService.getRandomDate())
  }

  const formatDate = (dateString: string) => {
    return apodService.getFormattedDate(dateString)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="Failed to load APOD data" onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Astronomy Picture of the Day
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, 
            along with a brief explanation written by a professional astronomer.
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
              <FaCalendar className="text-blue-400 text-xl" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min="1995-06-16"
                max={new Date().toISOString().split('T')[0]}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-300">
                {formatDate(selectedDate)}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRandomDate}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Random Date
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* APOD Content */}
        {apod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Image/Video */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
              {apod.media_type === 'video' ? (
                <div className="aspect-video">
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={apod.hdurl || apod.url}
                    alt={apod.title}
                    className="w-full h-auto max-h-96 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={apod.hdurl || apod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/30 transition-colors duration-200"
                    >
                      <FaExternalLinkAlt size={16} />
                      <span>View Full Size</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-3xl font-bold mb-4 text-blue-400">
                    {apod.title}
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {apod.explanation}
                  </p>
                </div>

                {apod.copyright && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-2 text-purple-400">
                      Image Credit
                    </h3>
                    <p className="text-gray-300">
                      {apod.copyright}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-green-400">
                    Image Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Date: </span>
                      <span className="text-white">{formatDate(apod.date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type: </span>
                      <span className="text-white capitalize">{apod.media_type}</span>
                    </div>
                    {apod.service_version && (
                      <div>
                        <span className="text-gray-400">Service Version: </span>
                        <span className="text-white">{apod.service_version}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={apod.hdurl || apod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-all duration-200"
                    >
                      Download HD Image
                    </a>
                    <button
                      onClick={handleRandomDate}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      Random APOD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default APOD 