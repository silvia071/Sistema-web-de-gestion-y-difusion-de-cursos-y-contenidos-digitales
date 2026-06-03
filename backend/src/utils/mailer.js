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

// --- FUNCIONES EXTRAÍDAS DEL PDF ---

const escapeHtml = (unsafe) => {
  if (!unsafe) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(Number(value || 0));
};

// --- SERVICIOS DE MAILS ---

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

const sendOrderConfirmationEmail = async ({ to, orden, numeroOrden }) => {
  const transporter = createTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  
  const itemRows = (orden.detalles || []).map(detalle => {
    const curso = detalle.curso || {};
    return `
    <tr>
      <td style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">${escapeHtml(curso.titulo || 'Curso')}</td>
      <td style="padding: 8px; border-bottom: 2px solid #ddd; text-align: center;">1</td>
      <td style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">${formatCurrency(detalle.precioUnitario)}</td>
      <td style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">${formatCurrency(detalle.subtotal)}</td>
    </tr>
    `;
  }).join('');

  
  const htmlContent = `
    <h1>Recibimos tu orden de compra!</h1>
    <p>Gracias. Este es el detalle de tu orden:</p>
    
    ${numeroOrden ? `<p><strong>Pedido:</strong> ${escapeHtml(numeroOrden)}</p>` : ''}
    <p><strong>Medio de pago:</strong> ${escapeHtml(orden.medioPago || 'Mercado Pago')}</p>
    <p><strong>Entrega:</strong> ${escapeHtml(orden.metodoEntrega || 'Acceso Digital')}</p>
    
    <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
      <thead>
        <tr>
          <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Producto</th>
          <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: center;">Cantidad</th>
          <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Precio</th>
          <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <p style="font-size: 18px;"><strong>Total: ${formatCurrency(orden.total)}</strong></p>
    <p>Una vez acreditado el pago podrás acceder al curso.</p>
  `;

  return transporter.sendMail({
    from,
    to,
    subject: "Recibimos tu orden de compra!",
    html: htmlContent,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};