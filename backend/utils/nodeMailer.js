const nodemailer = require('nodemailer');
require('dotenv').config(); 


// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another service like 'Outlook', 'Yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass:"oflo ynqb laol ipdk"  
  }
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html // html body
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
