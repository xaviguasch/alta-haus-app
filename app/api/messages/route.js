import connectDB from '@/config/database'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export const dynamic = 'force-dynamic'

// POST /api/messages
export const POST = async (request) => {
  try {
    await connectDB()

    const { name, email, phone, message, property, recipient } = await request.json()

    const sessionUser = await getSessionUser()

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({ message: 'You must be logged in to send a message' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )

      // return Response.json({
      //   message: 'You must be logged in to send a message',
      // })
    }

    const { user } = sessionUser

    // Can not send message to self
    if (user.id === recipient) {
      console.log('Can not send a message to yourself')

      return new Response(
        JSON.stringify({ message: 'Can not send a message to yourself' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
      // return Response.json({ message: 'Can not send a message to yourself' })
    }

    const newMessage = new Message({
      sender: user.id,
      recipient,
      property,
      name,
      email,
      phone,
      body: message,
    })

    await newMessage.save()

    return new Response(JSON.stringify({ message: 'Message sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

    // return Response.json({ message: 'Message Sent' })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
    // return new Response('Something went wrong', { status: 500 })
  }
}
