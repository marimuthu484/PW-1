const express = require('express');
const router = express.Router();
const {
  startConsultation,
  endConsultation,
  getConsultation
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');
const { isDoctor } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/start', isDoctor, startConsultation);
router.put('/:consultationId/end', isDoctor, endConsultation);
router.get('/:id', getConsultation);

module.exports = router;
