export async function GET(request, { params }) {
  // we will use params to access the data passed to the dynamic route
  console.log(params)
  const post = params.post;
  return new Response(`Welcome to my Next application, post: ${post}`);
}
export async function GET(request) {
  // username parent route
  return new Response("This is my parent route");
}