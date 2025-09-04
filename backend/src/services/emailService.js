const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if nodemailer is properly loaded
    if (!nodemailer || !nodemailer.createTransporter) {
      console.error('Nodemailer not properly loaded');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } catch (error) {
      console.error('Error creating email transporter:', error);
      this.transporter = null;
    }
  }

  async sendEmail(to, subject, html) {
    if (!this.transporter) {
      console.log('Email transporter not configured, skipping email send');
      return;
    }

    try {
      const mailOptions = {
        from: `HealthPredict <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      // Don't throw error to prevent app crash
    }
  }

  async sendDoctorRegistrationNotification(doctor) {
    if (!process.env.ADMIN_EMAIL) return;
    
    const subject = 'New Doctor Registration - HealthPredict';
    const html = `
      <h2>New Doctor Registration</h2>
      <p>A new doctor has registered on HealthPredict and is awaiting approval.</p>
      <p><strong>Name:</strong> ${doctor.name}</p>
      <p><strong>Email:</strong> ${doctor.email}</p>
      <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
      <p>Please login to the admin dashboard to review and approve/reject this registration.</p>
    `;

    await this.sendEmail(process.env.ADMIN_EMAIL, subject, html);
  }

  async sendDoctorApprovalEmail(email, name) {
    const subject = 'Registration Approved - HealthPredict';
    const html = `
      <h2>Congratulations Dr. ${name}!</h2>
      <p>Your registration on HealthPredict has been approved.</p>
      <p>You can now login to your dashboard and start managing appointments.</p>
      <p><a href="${process.env.CLIENT_URL}/login">Login to Dashboard</a></p>
      <br>
      <p>Best regards,<br>HealthPredict Team</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  async sendDoctorRejectionEmail(email, name, reason) {
    const subject = 'Registration Status - HealthPredict';
    const html = `
      <h2>Dear Dr. ${name},</h2>
      <p>Thank you for registering on HealthPredict.</p>
      <p>After reviewing your application, we regret to inform you that we cannot approve your registration at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is an error or would like to provide additional information, please contact our support team.</p>
      <br>
      <p>Best regards,<br>HealthPredict Team</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  async sendAppointmentConfirmation(email, appointmentDetails) {
    const subject = 'Appointment Confirmation - HealthPredict';
    const html = `
      <h2>Appointment Confirmed</h2>
      <p>Your appointment has been successfully scheduled.</p>
      <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
      <p><strong>Date:</strong> ${appointmentDetails.date}</p>
      <p><strong>Time:</strong> ${appointmentDetails.time}</p>
      <p><strong>Type:</strong> ${appointmentDetails.type}</p>
      <br>
      <p>Please login to your dashboard for more details.</p>
      <p>Best regards,<br>HealthPredict Team</p>
    `;

    await this.sendEmail(email, subject, html);
  }
}

// Create a singleton instance
const emailService = new EmailService();
module.exports = emailService;
