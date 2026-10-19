import {NextResponse} from 'next/server'

// The Sanity-backed assistant is archived until durable storage and limits return.
function unavailable() {
  return NextResponse.json(
    {error: 'The assistant is paused during the redesign. Please use the email or phone contact buttons.'},
    {status: 503, headers: {'Cache-Control': 'no-store'}},
  )
}

export const GET = unavailable
export const POST = unavailable
