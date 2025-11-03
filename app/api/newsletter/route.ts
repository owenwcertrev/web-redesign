import { NextRequest, NextResponse } from 'next/server'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // For MVP, just log the subscription
    console.log(`Newsletter subscription: ${email}`)

    // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
    // Example with Mailchimp:
    // const response = await fetch(`https://usX.api.mailchimp.com/3.0/lists/${listId}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //   }),
    // })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
