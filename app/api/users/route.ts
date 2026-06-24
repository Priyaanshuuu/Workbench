import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = store.getAllUsers();
  const enriched = users.map((user) => ({ ...user, roles: store.getRolesForUser(user.id) }));
  return NextResponse.json({ data: enriched });
}