const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const emailService = require('../services/emailService');
const { APPOINTMENT_STATUS } = require('../config/constants');

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    // Get patient info
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    // Verify doctor exists and is approved
    const doctor = await Doctor.findById(doctorId).populate('userId');
    if (!doctor || doctor.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or not approved'
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is not available'
      });
    }

    // Create appointment with proper ObjectId
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id, // Ensure this is ObjectId
      date: new Date(date),
      timeSlot,
      reason,
      payment: {
        amount: doctor.consultationFee
      }
    });

    // Populate for response
    await appointment.populate([
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      },
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      }
    ]);

    // Send confirmation email
    await emailService.sendAppointmentConfirmation(req.user.email, {
      doctorName: doctor.userId.name,
      date: date,
      time: timeSlot,
      type: 'Video Consultation'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    console.log('Update appointment request:', {
      appointmentId,
      status,
      userId: req.user._id
    });

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Find appointment first
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Get doctor info for the logged-in user
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    console.log('Doctor comparison:', {
      appointmentDoctorId: appointment.doctorId.toString(),
      currentDoctorId: doctor._id.toString(),
      match: appointment.doctorId.toString() === doctor._id.toString()
    });

    // Check if the doctor is authorized
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this appointment'
      });
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    // Populate for response
    await appointment.populate([
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      },
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      }
    ]);

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get appointment details
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permission
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });

    const hasAccess = 
      req.user.role === 'admin' ||
      (patient && appointment.patientId._id.toString() === patient._id.toString()) ||
      (doctor && appointment.doctorId._id.toString() === doctor._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user can cancel
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });

    const canCancel = 
      (patient && appointment.patientId.toString() === patient._id.toString()) ||
      (doctor && appointment.doctorId.toString() === doctor._id.toString());

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    appointment.status = APPOINTMENT_STATUS.CANCELLED;
    await appointment.save();

    // Populate for response
    await appointment.populate([
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      },
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
