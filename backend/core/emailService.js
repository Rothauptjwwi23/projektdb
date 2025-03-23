import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // oder z. B. "Outlook", "Yahoo", SMTP-Host etc.
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmation = async (email, event) => {
  await transporter.sendMail({
    from: '"EventBooker" <no-reply@eventbooker.com>',
    to: email,
    subject: `Buchungsbestätigung: ${event.title}`,
    html: `
      <h2>🎉 Vielen Dank für deine Buchung!</h2>
      <p><strong>Event:</strong> ${event.title}</p>
      <p><strong>Ort:</strong> ${event.location}</p>
      <p><strong>Datum:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p>Deine Buchung ist bestätigt. Wir freuen uns auf dich!</p>
    `,
  });
};
