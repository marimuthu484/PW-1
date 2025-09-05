const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

// Start consultation
exports.startConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify doctor has access
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment is confirmed
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Appointment must be confirmed before starting consultation'
      });
    }

    // Check if consultation already exists
    let consultation = await Consultation.findOne({ appointmentId });
    
    if (consultation) {
      // Consultation already exists, return it
      return res.json({
        success: true,
        message: 'Consultation already started',
        consultation,
        meetingLink: `${process.env.CLIENT_URL}/video-call/${consultation._id}`
      });
    }

    // Create consultation
    consultation = await Consultation.create({
      appointmentId,
      startTime: new Date(),
      meetingLink: `${process.env.CLIENT_URL}/video-call/${appointmentId}`,
      roomId: `room-${appointmentId}-${Date.now()}`
    });

    // Update appointment status to in-progress
    appointment.status = 'in-progress';
    await appointment.save();

    // Create notification for patient
    await notificationService.createNotification(
      appointment.patientId.userId._id,
      'consultation',
      'Video Consultation Started',
      `Dr. ${appointment.doctorId.userId.name} has started the video consultation. Click to join.`,
      {
        consultationId: consultation._id,
        appointmentId: appointment._id,
        meetingLink: consultation.meetingLink
      }
    );

    res.status(201).json({
      success: true,
      message: 'Consultation started',
      consultation,
      meetingLink: consultation.meetingLink
    });
  } catch (error) {
    console.error('Error starting consultation:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get active consultation for patient
exports.getActiveConsultation = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    // Find active consultations for this patient
    const appointments = await Appointment.find({
      patientId: patient._id,
      status: 'in-progress'
    });

    const appointmentIds = appointments.map(a => a._id);
    
    const consultation = await Consultation.findOne({
      appointmentId: { $in: appointmentIds },
      endTime: null
    }).populate({
      path: 'appointmentId',
      populate: [
        {
          path: 'doctorId',
          populate: { path: 'userId', select: 'name email' }
        }
      ]
    });

    res.json({
      success: true,
      hasActiveConsultation: !!consultation,
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

    const consultation = await Consultation.findById(consultationId)
      .populate('appointmentId');
      
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
    await Appointment.findByIdAndUpdate(consultation.appointmentId._id, {
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
      .populate({
        path: 'appointmentId',
        populate: [
          {
            path: 'patientId',
            populate: { path: 'userId', select: 'name email' }
          },
          {
            path: 'doctorId', 
            populate: { path: 'userId', select: 'name email' }
          }
        ]
      })
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
