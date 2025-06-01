const transporter = require('../config/mailConfig');

async function sendNotificationEmail(subject, text, to = 'recipient@example.com') {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent:', subject);
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
}

module.exports = { sendNotificationEmail };
