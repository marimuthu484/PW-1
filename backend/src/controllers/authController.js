const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { USER_ROLES } = require('../config/constants');
const emailService = require('../services/emailService');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || USER_ROLES.PATIENT
    });

    // Create role-specific profile
    if (role === USER_ROLES.DOCTOR) {
      const { specialization, qualification, experience, licenseNumber, clinicAddress, phone, consultationFee } = additionalData;
      
      await Doctor.create({
        userId: user._id,
        specialization,
        qualification,
        experience,
        licenseNumber,
        clinicAddress,
        phone,
        consultationFee
      });

      // Send notification to admin
      await emailService.sendDoctorRegistrationNotification(user);
    } else if (role === USER_ROLES.PATIENT || !role) {
      await Patient.create({
        userId: user._id,
        phone: additionalData.phone || '',
        dateOfBirth: additionalData.dateOfBirth,
        gender: additionalData.gender
      });
    }

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: role === USER_ROLES.DOCTOR 
        ? 'Registration successful. Please wait for admin approval.' 
        : 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user role matches
    if (userType && user.role !== userType) {
      return res.status(401).json({
        success: false,
        message: `This account is registered as ${user.role}, not ${userType}`
      });
    }

    // Check if doctor is approved
    if (user.role === USER_ROLES.DOCTOR) {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor.status !== 'approved') {
        return res.status(401).json({
          success: false,
          message: doctor.status === 'rejected' 
            ? 'Your registration has been rejected. Please contact admin.' 
            : 'Your registration is pending approval. Please wait for admin verification.'
        });
      }
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    let userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    };

    // Get role-specific data
    if (req.user.role === USER_ROLES.DOCTOR) {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      userData.doctorInfo = doctor;
    } else if (req.user.role === USER_ROLES.PATIENT) {
      const patient = await Patient.findOne({ userId: req.user._id });
      userData.patientInfo = patient;
    }

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

