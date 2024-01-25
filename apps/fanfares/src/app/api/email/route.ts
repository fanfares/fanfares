export async function GET(request: Request) {
    // throw new Error("TEST EMAIL ERROR");
  return new Response(JSON.stringify({email: true, get: true}), { status: 200 })
}


// import sgMail from "@sendgrid/mail"

// import type { NextApiRequest, NextApiResponse } from "next"

// sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).end("Method not allowed")
//   }

//   const { name, email, message } = req.body

//   const msg = {
//     to: "support@fanfares.io", // Replace with your email
//     from: "support@fanfares.io", // Replace with a verified sender email
//     subject: "New Contact Form Submission",
//     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//   }

//   try {
//     await sgMail.send(msg)
//     res.status(200).end("Email sent successfully")
//   } catch (error) {
//     console.error(error)
//     res.status(500).end("Error sending email")
//   }
// }
