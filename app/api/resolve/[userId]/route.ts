import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { buildUserResolvedPermissions } from "@/lib/permission";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ userId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { userId } = await params;
  const user = store.getUserById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const roles = store.getRolesForUser(userId);
  const resolved = buildUserResolvedPermissions(user, roles);
  return NextResponse.json({ data: resolved });
}