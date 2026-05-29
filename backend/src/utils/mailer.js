const nodemailer = require("nodemailer");

const requiredMailEnvVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

const createTransporter = () => {
  const missingEnvVars = requiredMailEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Faltan variables SMTP: ${missingEnvVars.join(", ")}`
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendPasswordResetEmail = async ({ to, resetLink }) => {
  const transporter = createTransporter();

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from,
    to,
    subject: "Recuperación de contraseña",
    text: [
      "Recibimos una solicitud para recuperar tu contraseña.",
      "",
      `Ingresa al siguiente enlace para crear una nueva contraseña: ${resetLink}`,
      "",
      "Este enlace vence en 15 minutos y solo puede usarse una vez.",
      "",
      "Si no solicitaste este cambio, podes ignorar este mensaje.",
    ].join("\n"),
    html: `
      <p>Recibimos una solicitud para recuperar tu contraseña.</p>
      <p>
        <a href="${resetLink}">Crear nueva contraseña</a>
      </p>
      <p>Este enlace vence en 15 minutos y solo puede usarse una vez.</p>
      <p>Si no solicitaste este cambio, podes ignorar este mensaje.</p>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
};