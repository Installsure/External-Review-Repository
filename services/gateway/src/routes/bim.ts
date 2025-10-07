import { Router, Request, Response } from 'express';
import axios from 'axios';
import multer from 'multer';
import { logger } from '../infra/logger.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// BIM service configuration
const BIM_SERVICE_URL = process.env.BIM_SERVICE_URL || 'http://localhost:8002';

// Health check for BIM service
router.get('/health', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${BIM_SERVICE_URL}/health`);
    res.json({
      gateway: 'healthy',
      bim_service: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('BIM service health check failed', { error });
    res.status(503).json({
      gateway: 'healthy',
      bim_service: 'unhealthy',
      error: 'BIM service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// Upload IFC file
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Validate file type
    if (!req.file.originalname.toLowerCase().endsWith('.ifc')) {
      return res.status(400).json({
        success: false,
        error: 'Only IFC files are supported'
      });
    }

    // Create form data for BIM service
    const FormData = require('form-data');
    const fs = require('fs');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: 'application/octet-stream'
    });

    // Forward to BIM service
    const response = await axios.post(`${BIM_SERVICE_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    });

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    logger.info('IFC file processed successfully', { 
      filename: req.file.originalname,
      project_id: response.data.project_id 
    });

    res.json(response.data);

  } catch (error: any) {
    logger.error('Error processing IFC upload', { error: error.message });
    
    // Clean up temporary file if it exists
    if (req.file?.path) {
      try {
        require('fs').unlinkSync(req.file.path);
      } catch (cleanupError) {
        logger.error('Error cleaning up temporary file', { error: cleanupError });
      }
    }

    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data.detail || 'BIM service error'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Get project details
router.get('/projects/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const response = await axios.get(`${BIM_SERVICE_URL}/projects/${projectId}`);
    res.json(response.data);

  } catch (error: any) {
    logger.error('Error fetching project', { projectId: req.params.projectId, error: error.message });
    
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Get project quantities
router.get('/projects/:projectId/quantities', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const response = await axios.get(`${BIM_SERVICE_URL}/projects/${projectId}/quantities`);
    res.json(response.data);

  } catch (error: any) {
    logger.error('Error fetching quantities', { projectId: req.params.projectId, error: error.message });
    
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Generate cost estimate
router.post('/projects/:projectId/estimate', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const response = await axios.post(`${BIM_SERVICE_URL}/projects/${projectId}/estimate`);
    res.json(response.data);

  } catch (error: any) {
    logger.error('Error generating estimate', { projectId: req.params.projectId, error: error.message });
    
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Download PDF report
router.get('/projects/:projectId/report', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const response = await axios.get(`${BIM_SERVICE_URL}/projects/${projectId}/report`, {
      responseType: 'stream'
    });

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="project_${projectId}_report.pdf"`);
    
    // Pipe the response
    response.data.pipe(res);

  } catch (error: any) {
    logger.error('Error downloading report', { projectId: req.params.projectId, error: error.message });
    
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        error: 'Project or report not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// List all projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${BIM_SERVICE_URL}/projects`);
    res.json(response.data);

  } catch (error: any) {
    logger.error('Error listing projects', { error: error.message });
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;