import { FeedbackInputs } from "@/app/controllers/state/feedpack-form-slice";
import sgMail from "@sendgrid/mail"

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

export async function POST(
  request: Request
) {

  const { publicKey, lud16, email, message } = (await request.json() as FeedbackInputs)

  if(!publicKey) throw new Error("Public Key is required")
  if(!lud16) throw new Error("Alby address is required")
  if(!email) throw new Error("Email is required")
  if(!message) throw new Error("Message is required")

  const feedback = {
    to: "support@fanfares.io", // Replace with your email
    from: "support@fanfares.io", // Replace with a verified sender email
    subject: `FEEDBACK: ${publicKey}`,
    text: `
      Email: ${email}
      LightningAddress: ${lud16}
      PublicKey: ${publicKey}
      Message: ${message}
    `,
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY)
    await sgMail.send(feedback)
    return new Response("Feedback sent!", { status: 200 })
  } catch (e) {
    throw new Error(`Error sending email - ${e}`)
  }
}