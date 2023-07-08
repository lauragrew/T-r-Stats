// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define the email options
  const mailOptions = {
    from: 'Jonas Schmedtmann <hello@jonas.io>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    // html: options.html, // html body
  };

  // 3) send email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
