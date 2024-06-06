// A faulty API route to test Sentry's error monitoring
export async function POST(request: Request) {

    const body = (await request.json()) ?? {empty: true};
    const returnBody = {test: true, post: true, ...body};
    const returnBodyString = JSON.stringify(returnBody);

    return new Response(
        returnBodyString, 
        { status: 200 }
    );
  }
  
  export async function GET(request: Request) {
    return new Response(JSON.stringify({test: true, get: true}), { status: 200 })
  }
  