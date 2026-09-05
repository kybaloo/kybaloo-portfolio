const gone = () =>
  new Response('Gone', {
    status: 410,
    headers: {'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex'},
  });

export const GET = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
