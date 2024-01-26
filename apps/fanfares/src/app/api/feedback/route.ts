import sgMail from "@sendgrid/mail"

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

export async function POST(
  request: Request
) {

  const { lud16, email, message } = await request.json()

  if(!lud16) throw new Error("LUD16 is required")
  if(!email) throw new Error("Email is required")
  if(!message) throw new Error("Message is required")

  const msg = {
    to: "support@fanfares.io", // Replace with your email
    from: "support@fanfares.io", // Replace with a verified sender email
    subject: `FEEDBACK: ${email}`,
    text: `LUD16: ${email}\nName: ${name}\nMessage: ${message}`,
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY)
    await sgMail.send(msg)
    return new Response("Email sent!", { status: 200 })
  } catch (e) {
    throw new Error(`Error sending email - ${e}`)
  }
}