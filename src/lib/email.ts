import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "אמת את כתובת האימייל שלך - AnswerPlus",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; direction: rtl;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="background: #4f46e5; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">✦ AnswerPlus</h1>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #1f2937; font-size: 20px; margin-top: 0;">שלום, ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">תודה שנרשמת ל-AnswerPlus. כדי להפעיל את חשבונך, אנא אמת את כתובת האימייל שלך בלחיצה על הכפתור:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">אמת את כתובת האימייל</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">הקישור יפוג תוך 24 שעות.</p>
            <p style="color: #6b7280; font-size: 14px;">אם לא נרשמת ל-AnswerPlus, ניתן להתעלם מהודעה זו.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; word-break: break-all;">אם הכפתור לא עובד, העתק את הקישור הבא לדפדפן:<br />${verificationUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `שלום, ${name}!\n\nאמת את כתובת האימייל שלך:\n${verificationUrl}\n\nהקישור יפוג תוך 24 שעות.`,
  });
}
