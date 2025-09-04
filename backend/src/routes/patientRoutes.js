const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDoctors,
  getAppointments
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { isPatient } = require('../middleware/roleMiddleware');

// All routes require authentication and patient role
router.use(protect, isPatient);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/doctors', getDoctors);
router.get('/appointments', getAppointments);

module.exports = router;
