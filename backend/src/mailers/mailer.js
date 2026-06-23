import { resend } from "../config/resend.config.js";
const mailer_sender = `Revona <${process.env.RESEND_MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  from = mailer_sender,
  subject,
  text,
  html,
}) => {
  return await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    text,
    subject,
    html,
  });
};