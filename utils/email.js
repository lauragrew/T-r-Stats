// This code provides a reusable function (sendEmail) that abstracts the process of sending emails using the Nodemailer library. It simplifies the process of creating and configuring a transporter, defining email options, and sending the email. The function can be used to send emails with various content and recipients by passing appropriate options as an argument

const nodemailer = require("nodemailer");

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
    from: "Tir Stats <TirStats@.hotmail.com>", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    // html: options.html, // html body
  };

  // 3) send email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
