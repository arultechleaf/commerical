const maxMessageLength = 1000;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Please send a valid message." }, { status: 400 });
  }

  if (
    typeof payload !== "object"
    || payload === null
    || !("message" in payload)
    || typeof payload.message !== "string"
    || !payload.message.trim()
    || payload.message.length > maxMessageLength
  ) {
    return Response.json({ error: "Message must be between 1 and 1000 characters." }, { status: 400 });
  }

  return Response.json({ reply: "Thanks for your message! Our team will be happy to help you." });
}
