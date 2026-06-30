import { getAdminUser, adminUnauthorized } from "@/lib/admin-auth";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  return Response.json(user);
}
