const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, from, subject, text, html) => {
  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  console.log('Sending email with the following details:', msg);

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error response:', error.response.body);
    }
  }
};

module.exports = { sendEmail };