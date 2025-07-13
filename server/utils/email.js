const nodemailer = require('nodemailer');
const qrcode = require('qrcode');

const sendReservationEmail = async (userEmail, name, event, reservationId, noReservations) => {
  try {
    const qrCodeDataUrl = await qrcode.toDataURL(reservationId);

    let transporter;
    if (process.env.NODE_ENV === 'production') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: '"Vibe" <no-reply@vibe.com>',
      to: userEmail,
      subject: `Your Reservation Confirmation for ${event.title}`,
      html: `
        <div style="max-width: 600px; margin: auto; padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h1 style="color: #d98ff2; text-align: center; margin-bottom: 24px;">🎉 Reservation Confirmed!</h1>

        <p style="font-size: 16px; margin-bottom: 16px;">Hi <strong>${name}</strong>,</p>

        <p style="font-size: 16px; margin-bottom: 16px;">
            Your reservation for <strong>${event.title}</strong> is confirmed! We’re excited to have you join us.
        </p>

        <div style="background-color: #fff; padding: 16px 20px; border-radius: 6px; border: 1px solid #ddd; margin-bottom: 24px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-top: 0;">📅 Event Details</h3>
            <p style="margin: 8px 0;"><strong>Event:</strong> ${event.title}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${event.time}</p>
            <p style="margin: 8px 0;"><strong>Tickets Reserved:</strong> ${noReservations}</p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 6px;">🔍 Your QR Code</h3>
            <p style="font-size: 14px; margin-bottom: 12px;">Present this QR code at the event check-in:</p>
            <img src="cid:qrcode" alt="Reservation QR Code" style="width: 180px; height: 180px; border: 1px solid #ccc; padding: 4px; border-radius: 6px; background: #fff;" />
            <p style="font-size: 14px; margin-top: 12px; color: #666;">Reservation ID: <strong>${reservationId}</strong></p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 32px 0;">

        <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not make this reservation, you can safely ignore this email.
        </p>
        </div>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeDataUrl.split("base64,")[1],
          encoding: 'base64',
          cid: 'qrcode'
        }
      ]
    };

    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending reservation email:', error);
  }
};

module.exports = { sendReservationEmail };