import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FaRocket, FaCalendar, FaCamera, FaExternalLinkAlt } from 'react-icons/fa'
import { apiService } from '../services/api'
import { MarsRoverPhoto } from '../types/nasa'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const MarsRovers = () => {
  const [selectedRover, setSelectedRover] = useState('curiosity')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCamera, setSelectedCamera] = useState('all')

  const rovers = [
    { id: 'curiosity', name: 'Curiosity', landingDate: '2012-08-06', status: 'active' },
    { id: 'opportunity', name: 'Opportunity', landingDate: '2004-01-25', status: 'complete' },
    { id: 'spirit', name: 'Spirit', landingDate: '2004-01-04', status: 'complete' },
    { id: 'perseverance', name: 'Perseverance', landingDate: '2021-02-18', status: 'active' }
  ]

  const cameras = {
    curiosity: [
      { id: 'all', name: 'All Cameras' },
      { id: 'fhaz', name: 'Front Hazard Avoidance Camera' },
      { id: 'rhaz', name: 'Rear Hazard Avoidance Camera' },
      { id: 'mast', name: 'Mast Camera' },
      { id: 'chemcam', name: 'Chemistry and Camera Complex' },
      { id: 'mahli', name: 'Mars Hand Lens Imager' },
      { id: 'mardi', name: 'Mars Descent Imager' },
      { id: 'navcam', name: 'Navigation Camera' }
    ],
    opportunity: [
      { id: 'all', name: 'All Cameras' },
      { id: 'fhaz', name: 'Front Hazard Avoidance Camera' },
      { id: 'rhaz', name: 'Rear Hazard Avoidance Camera' },
      { id: 'navcam', name: 'Navigation Camera' },
      { id: 'pancam', name: 'Panoramic Camera' },
      { id: 'minites', name: 'Miniature Thermal Emission Spectrometer' }
    ],
    spirit: [
      { id: 'all', name: 'All Cameras' },
      { id: 'fhaz', name: 'Front Hazard Avoidance Camera' },
      { id: 'rhaz', name: 'Rear Hazard Avoidance Camera' },
      { id: 'navcam', name: 'Navigation Camera' },
      { id: 'pancam', name: 'Panoramic Camera' },
      { id: 'minites', name: 'Miniature Thermal Emission Spectrometer' }
    ],
    perseverance: [
      { id: 'all', name: 'All Cameras' },
      { id: 'edl_rucam', name: 'Rover Up-Look Camera' },
      { id: 'edl_ddcam', name: 'Descent Stage Down-Look Camera' },
      { id: 'edl_pucam1', name: 'Parachute Up-Look Camera A' },
      { id: 'edl_pucam2', name: 'Parachute Up-Look Camera B' },
      { id: 'navcam_left', name: 'Navigation Camera - Left' },
      { id: 'navcam_right', name: 'Navigation Camera - Right' },
      { id: 'mcz_left', name: 'Mast Camera Zoom - Left' },
      { id: 'mcz_right', name: 'Mast Camera Zoom - Right' },
      { id: 'front_hazcam_left_a', name: 'Front Hazard Avoidance Camera - Left A' },
      { id: 'front_hazcam_right_a', name: 'Front Hazard Avoidance Camera - Right A' },
      { id: 'rear_hazcam_left', name: 'Rear Hazard Avoidance Camera - Left' },
      { id: 'rear_hazcam_right', name: 'Rear Hazard Avoidance Camera - Right' },
      { id: 'edl_rdcam', name: 'Rover Down-Look Camera' },
      { id: 'skycam', name: 'MEDA Skycam' },
      { id: 'sherloc_watson', name: 'SHERLOC WATSON Camera' },
      { id: 'supercam_rmi', name: 'SuperCam Remote Micro Imager' },
      { id: 'lcam', name: 'Lander Vision System Camera' }
    ]
  }

  const { data: photosData, isLoading, error, refetch } = useQuery({
    queryKey: ['mars-rover', selectedRover, selectedDate, selectedCamera],
    queryFn: () => apiService.getMarsRoverPhotos(selectedRover, { earth_date: selectedDate, camera: selectedCamera }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Handle the photos data structure
  const photos = photosData?.photos || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="Failed to load Mars rover photos" onRetry={refetch} />
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
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Mars Rover Photos
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the Red Planet through the eyes of NASA's Mars rovers. 
            View high-resolution images captured by Curiosity, Opportunity, Spirit, and Perseverance.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rover Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaRocket className="inline mr-2" />
                Select Rover
              </label>
              <select
                value={selectedRover}
                onChange={(e) => setSelectedRover(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {rovers.map((rover) => (
                  <option key={rover.id} value={rover.id}>
                    {rover.name} ({rover.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaCalendar className="inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Camera Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaCamera className="inline mr-2" />
                Select Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {cameras[selectedRover as keyof typeof cameras]?.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Rover Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rovers.map((rover) => (
              <div
                key={rover.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedRover === rover.id
                    ? 'border-red-400 bg-red-400/20'
                    : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => setSelectedRover(rover.id)}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{rover.name}</h3>
                <p className="text-sm text-gray-300 mb-1">
                  Landing: {formatDate(rover.landingDate)}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  rover.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {rover.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Photos Grid */}
        {photos && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {photos.length === 0 ? (
              <div className="text-center py-12">
                <FaCamera className="text-6xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No photos found
                </h3>
                <p className="text-gray-400">
                  Try selecting a different date or camera for this rover.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Photos from {rovers.find(r => r.id === selectedRover)?.name}
                  </h2>
                  <p className="text-gray-300">
                    {photos.length} photo{photos.length !== 1 ? 's' : ''} taken on {formatDate(selectedDate)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {photos.map((photo: MarsRoverPhoto, index: number) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square">
                          <img
                            src={photo.img_src}
                            alt={`Mars photo ${photo.id}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <a
                              href={photo.img_src}
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
                            Photo {photo.id}
                          </h3>
                          <p className="text-sm text-gray-300 mb-2">
                            Camera: {photo.camera.full_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            Sol: {photo.sol} • Earth Date: {formatDate(photo.earth_date)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MarsRovers 