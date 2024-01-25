// A faulty API route to test Sentry's error monitoring
export async function POST(request: Request) {
  throw new Error("Sentry Example API Route Error");

  return new Response(JSON.stringify({test: true, post: true}), { status: 200 })
}

export async function GET(request: Request) {
    throw new Error("TEST ERROR");
  return new Response(JSON.stringify({test: true, get: true}), { status: 200 })
}


