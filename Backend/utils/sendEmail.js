import Brevo from "@getbrevo/brevo";

const sendEmail = async ({ to, subject, html }) => {
  const apiInstance = new Brevo.TransactionalEmailsApi();

  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const emailData = {
    sender: {
      name: "QuickCart",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  await apiInstance.sendTransacEmail(emailData);
};

export default sendEmail;
