import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendar, 
  FaUser, 
  FaMapPin, 
  FaImage,
  FaVideo,
  FaMusic,
  FaDownload,
  FaStar,
  FaEye
} from 'react-icons/fa';
import { imageSearchService } from '../services/imageSearchService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface SearchFilters {
  q: string;
  center?: string;
  description?: string;
  keywords?: string;
  location?: string;
  nasa_id?: string;
  photographer?: string;
  title?: string;
  year_start?: string;
  year_end?: string;
  media_type?: 'image' | 'video' | 'audio';
  page: number;
}

const ImageSearch: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    q: '',
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nasa-images', searchFilters],
    queryFn: () => imageSearchService.searchNASAImages(searchFilters),
    enabled: searchFilters.q.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFilters.q.trim()) {
      setSearchFilters(prev => ({ ...prev, page: 1 }));
      refetch();
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setSearchFilters({
      q: searchFilters.q,
      page: 1,
    });
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <FaImage className="w-4 h-4" />;
      case 'video':
        return <FaVideo className="w-4 h-4" />;
      case 'audio':
        return <FaMusic className="w-4 h-4" />;
      default:
        return <FaImage className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return imageSearchService.getFormattedDate(dateString);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            NASA Image Search
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Explore NASA's vast collection of images, videos, and audio from space missions, 
            Earth observations, and astronomical discoveries.
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for images, videos, or audio..."
                  value={searchFilters.q}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white/20 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaFilter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/20"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaUser className="inline w-4 h-4 mr-2" />
                    Photographer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hubble Space Telescope"
                    value={searchFilters.photographer || ''}
                    onChange={(e) => handleFilterChange('photographer', e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaMapPin className="inline w-4 h-4 mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mars, Moon, ISS"
                    value={searchFilters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaCalendar className="inline w-4 h-4 mr-2" />
                      Year Start
                    </label>
                  <input
                    type="number"
                    placeholder="e.g., 1990"
                    value={searchFilters.year_start || ''}
                    onChange={(e) => handleFilterChange('year_start', e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaCalendar className="inline w-4 h-4 mr-2" />
                      Year End
                    </label>
                  <input
                    type="number"
                    placeholder="e.g., 2024"
                    value={searchFilters.year_end || ''}
                    onChange={(e) => handleFilterChange('year_end', e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Media Type
                  </label>
                  <select
                    value={searchFilters.media_type || ''}
                    onChange={(e) => handleFilterChange('media_type', e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 font-medium rounded-lg hover:bg-red-600/30 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Results */}
        {searchFilters.q && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error instanceof Error ? error.message : 'An error occurred'} onRetry={refetch} />
            ) : searchResults ? (
              <div>
                {/* Results Summary */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Search Results
                      </h2>
                      <p className="text-gray-300">
                        Found {searchResults.collection.metadata.total_hits.toLocaleString()} results
                        {searchResults.collection.items.length > 0 && (
                          <span> • Showing {searchResults.collection.items.length} items</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FaStar className="w-4 h-4" />
                      <span>NASA's Image and Video Library</span>
                    </div>
                  </div>
                </div>

                {/* Image Grid */}
                {searchResults.collection.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.collection.items.map((item: any, index: number) => (
                      <motion.div
                        key={item.data[0]?.nasa_id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden">
                          {item.links.find((link: any) => link.render === 'image') ? (
                            <img
                                                              src={item.links.find((link: any) => link.render === 'image')?.href}
                              alt={item.data[0]?.title || 'NASA Image'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                              <FaImage className="w-12 h-12 text-white/50" />
                            </div>
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex gap-2">
                              <a
                                href={item.links.find((link: any) => link.render === 'image')?.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-300"
                                title="View Full Size"
                              >
                                <FaEye className="w-5 h-5 text-white" />
                              </a>
                              <a
                                href={item.links.find((link: any) => link.rel === 'preview')?.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-300"
                                title="Download"
                              >
                                <FaDownload className="w-5 h-5 text-white" />
                              </a>
                            </div>
                          </div>

                          {/* Media Type Badge */}
                          <div className="absolute top-2 right-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-black/50 rounded-lg text-white text-xs">
                              {getMediaTypeIcon(item.data[0]?.media_type || 'image')}
                              <span className="capitalize">{item.data[0]?.media_type || 'image'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2 line-clamp-2">
                            {item.data[0]?.title || 'Untitled'}
                          </h3>
                          
                          {item.data[0]?.date_created && (
                            <p className="text-sm text-gray-300 mb-2">
                              {formatDate(item.data[0].date_created)}
                            </p>
                          )}

                          {item.data[0]?.photographer && (
                            <p className="text-sm text-gray-300 mb-2 flex items-center gap-1">
                              <FaUser className="w-3 h-3" />
                              {item.data[0].photographer}
                            </p>
                          )}

                          {item.data[0]?.location && (
                            <p className="text-sm text-gray-300 mb-2 flex items-center gap-1">
                              <FaMapPin className="w-3 h-3" />
                              {item.data[0].location}
                            </p>
                          )}

                          {item.data[0]?.description && (
                            <p className="text-sm text-gray-400 line-clamp-3">
                              {item.data[0].description}
                            </p>
                          )}

                          {/* Keywords */}
                          {item.data[0]?.keywords && item.data[0].keywords.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {item.data[0].keywords.slice(0, 3).map((keyword: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                              {item.data[0].keywords.length > 3 && (
                                <span className="px-2 py-1 bg-gray-600/20 text-gray-300 text-xs rounded-full">
                                  +{item.data[0].keywords.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                    <p className="text-gray-300">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {searchResults.collection.items.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(searchFilters.page - 1)}
                        disabled={searchFilters.page <= 1}
                        className="px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-white">
                        Page {searchFilters.page}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(searchFilters.page + 1)}
                        disabled={searchResults.collection.items.length < 100}
                        className="px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Search Tips */}
        {!searchFilters.q && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Search Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Use Keywords</h4>
                <p className="text-gray-300 text-sm">
                  Try searching for specific objects, missions, or phenomena like "Mars rover", 
                  "Hubble galaxy", or "solar eclipse"
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Filter by Photographer</h4>
                <p className="text-gray-300 text-sm">
                  Search for specific photographers or missions like "Hubble Space Telescope" 
                  or "International Space Station"
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaCalendar className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Use Date Ranges</h4>
                <p className="text-gray-300 text-sm">
                  Filter by year to find historical images or recent discoveries from 
                  specific time periods
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageSearch; 