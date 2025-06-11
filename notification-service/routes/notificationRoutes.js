const express = require('express');
const router = express.Router();
const { sendNotificationEmail } = require('../controllers/notificationController');

router.post('/send-email', async (req, res) => {
  const { subject, text, to } = req.body;

  try {
    await sendNotificationEmail(subject, text, to);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
