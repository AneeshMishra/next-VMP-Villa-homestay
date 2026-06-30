export async function POST() {
  const headers = new Headers();
  headers.set("Set-Cookie", "admin-token=; Path=/; HttpOnly; Max-Age=0");
  return new Response(null, { status: 204, headers });
}
