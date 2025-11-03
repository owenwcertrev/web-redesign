import { NextRequest, NextResponse } from 'next/server'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // For MVP, just log the contact form submission
    console.log('Contact form submission:', { name, email, company, message })

    // TODO: Integrate with Airtable or send email notification
    // Example with sending email via SendGrid:
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // await sgMail.send({
    //   to: 'certreviewed@gmail.com',
    //   from: 'noreply@certrev.com',
    //   subject: `Contact Form: ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
    // })

    // Example with Airtable:
    // const Airtable = require('airtable')
    // const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
    // await base('Contact Form').create([
    //   {
    //     fields: {
    //       Name: name,
    //       Email: email,
    //       Company: company || '',
    //       Message: message,
    //       'Submitted At': new Date().toISOString(),
    //     },
    //   },
    // ])

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}
