const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Start consultation
exports.startConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    // Verify appointment exists and belongs to doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if consultation already exists
    const existingConsultation = await Consultation.findOne({ appointmentId });
    if (existingConsultation) {
      return res.status(400).json({
        success: false,
        message: 'Consultation already started'
      });
    }

    // Create consultation
    const consultation = await Consultation.create({
      appointmentId,
      startTime: new Date(),
      meetingLink: `https://meet.healthpredict.com/${appointmentId}` // Mock link
    });

    // Update appointment status
    appointment.status = 'in-progress';
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Consultation started',
      consultation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// End consultation
exports.endConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { notes, diagnosis, followUpRequired, followUpDate } = req.body;

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Update consultation
    consultation.endTime = new Date();
    consultation.duration = Math.floor((consultation.endTime - consultation.startTime) / 60000); // in minutes
    consultation.notes = notes;
    consultation.diagnosis = diagnosis;
    consultation.followUpRequired = followUpRequired;
    consultation.followUpDate = followUpDate;
    
    await consultation.save();

    // Update appointment status
    await Appointment.findByIdAndUpdate(consultation.appointmentId, {
      status: 'completed'
    });

    res.json({
      success: true,
      message: 'Consultation ended successfully',
      consultation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get consultation details
exports.getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('appointmentId')
      .populate('prescriptionId');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      consultation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
