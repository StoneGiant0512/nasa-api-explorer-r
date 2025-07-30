"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
// NASA API configuration
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';
// Health check endpoint
app.get('/health', (req, res) => {
    const response = {
        success: true,
        data: { status: 'OK' },
        message: 'NASA API Backend is running',
        timestamp: new Date().toISOString()
    };
    res.json(response);
});
// APOD (Astronomy Picture of the Day)
app.get('/api/nasa/apod', async (req, res) => {
    try {
        const { date, start_date, end_date, count, thumbs } = req.query;
        const params = {
            api_key: NASA_API_KEY,
            ...(date && { date }),
            ...(start_date && { start_date }),
            ...(end_date && { end_date }),
            ...(count && { count }),
            ...(thumbs && { thumbs })
        };
        const response = await axios_1.default.get(`${NASA_BASE_URL}/planetary/apod`, { params });
        const apiResponse = {
            success: true,
            data: response.data,
            message: 'APOD data retrieved successfully',
            timestamp: new Date().toISOString()
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('APOD Error:', error.response?.data || error.message);
        const errorResponse = {
            success: false,
            error: 'APOD_FETCH_ERROR',
            message: error.response?.data?.msg || error.message,
            timestamp: new Date().toISOString()
        };
        res.status(500).json(errorResponse);
    }
});
// Mars Rovers
app.get('/api/nasa/mars-rovers', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers`, {
            params: { api_key: NASA_API_KEY }
        });
        const apiResponse = {
            success: true,
            data: response.data,
            message: 'Mars rovers data retrieved successfully',
            timestamp: new Date().toISOString()
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('Mars Rovers Error:', error.response?.data || error.message);
        const errorResponse = {
            success: false,
            error: 'MARS_ROVERS_FETCH_ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        };
        res.status(500).json(errorResponse);
    }
});
// Mars Rover Photos
app.get('/api/nasa/mars-rovers/:rover/photos', async (req, res) => {
    try {
        const { rover } = req.params;
        const { sol, earth_date, camera, page } = req.query;
        const params = {
            api_key: NASA_API_KEY,
            ...(sol && { sol }),
            ...(earth_date && { earth_date }),
            ...(camera && { camera }),
            ...(page && { page })
        };
        const response = await axios_1.default.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`, { params });
        const apiResponse = {
            success: true,
            data: response.data,
            message: `${rover} photos retrieved successfully`,
            timestamp: new Date().toISOString()
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('Mars Rover Photos Error:', error.response?.data || error.message);
        const errorResponse = {
            success: false,
            error: 'MARS_ROVER_PHOTOS_FETCH_ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        };
        res.status(500).json(errorResponse);
    }
});
// EPIC (Earth Imagery)
app.get('/api/nasa/epic', async (req, res) => {
    try {
        const { date } = req.query;
        const params = {
            api_key: NASA_API_KEY,
            ...(date && { date })
        };
        const response = await axios_1.default.get(`${NASA_BASE_URL}/EPIC/api/natural`, { params });
        const apiResponse = {
            success: true,
            data: response.data,
            message: 'EPIC data retrieved successfully',
            timestamp: new Date().toISOString()
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('EPIC Error:', error.response?.data || error.message);
        const errorResponse = {
            success: false,
            error: 'EPIC_FETCH_ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        };
        res.status(500).json(errorResponse);
    }
});
// NEO (Near Earth Objects)
app.get('/api/nasa/neo', async (req, res) => {
    try {
        const { start_date, end_date, asteroid_id } = req.query;
        const params = {
            api_key: NASA_API_KEY,
            ...(start_date && { start_date }),
            ...(end_date && { end_date }),
            ...(asteroid_id && { asteroid_id })
        };
        const response = await axios_1.default.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, { params });
        const apiResponse = {
            success: true,
            data: response.data,
            message: 'NEO data retrieved successfully',
            timestamp: new Date().toISOString()
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('NEO Error:', error.response?.data || error.message);
        const errorResponse = {
            success: false,
            error: 'NEO_FETCH_ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        };
        res.status(500).json(errorResponse);
    }
});
// NASA Image Search
app.get('/api/nasa/images', async (req, res) => {
    try {
        const { q, center, description, description_508, keywords, location, media_type, nasa_id, photographer, secondary_creator, title, year_start, year_end } = req.query;
        const params = {
            q,
            center,
            description,
            description_508,
            keywords,
            location,
            media_type,
            nasa_id,
            photographer,
            secondary_creator,
            title,
            year_start,
            year_end
        };
        const response = await axios_1.default.get(`${NASA_BASE_URL}/search`, { params });
        const apiResponse = {
            success: true,
            data: response.data,
            message: 'NASA images retrieved successfully',
            timestamp: new Date().toISOString()
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('NASA Images Error:', error.response?.data || error.message);
        const errorResponse = {
            success: false,
            error: 'NASA_IMAGES_FETCH_ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        };
        res.status(500).json(errorResponse);
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    const errorResponse = {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
});
// 404 handler
app.use('*', (req, res) => {
    const errorResponse = {
        success: false,
        error: 'NOT_FOUND',
        message: 'Endpoint not found',
        timestamp: new Date().toISOString()
    };
    res.status(404).json(errorResponse);
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 NASA API Backend running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
//# sourceMappingURL=server.js.map