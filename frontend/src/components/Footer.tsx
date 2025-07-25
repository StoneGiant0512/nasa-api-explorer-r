import { FaGithub, FaTwitter, FaLinkedin, FaRocket } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaRocket className="text-blue-400 text-2xl" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NASA Explorer
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Explore the wonders of space through NASA's vast collection of astronomical data, 
              images, and discoveries. From daily space photos to Mars rover images and near-Earth objects.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://api.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  NASA API
                </a>
              </li>
              <li>
                <a
                  href="https://www.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  NASA Official Site
                </a>
              </li>
              <li>
                <a
                  href="https://images.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  NASA Images
                </a>
              </li>
              <li>
                <a
                  href="https://mars.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Mars Exploration
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Features</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Astronomy Picture of the Day</span>
              </li>
              <li>
                <span className="text-gray-300">Mars Rover Photos</span>
              </li>
              <li>
                <span className="text-gray-300">EPIC Earth Images</span>
              </li>
              <li>
                <span className="text-gray-300">Near-Earth Objects</span>
              </li>
              <li>
                <span className="text-gray-300">NASA Image Search</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 NASA Explorer. This is not an official NASA website.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Powered by NASA Open APIs
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 