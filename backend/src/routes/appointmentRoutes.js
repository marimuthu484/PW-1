const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { isPatient, isDoctor } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

// Patient routes
router.post('/create', isPatient, createAppointment);

// Shared routes
router.get('/:id', getAppointment);
router.delete('/:id/cancel', cancelAppointment);

// Doctor routes
router.put('/:id/status', isDoctor, updateAppointmentStatus);

module.exports = router;
