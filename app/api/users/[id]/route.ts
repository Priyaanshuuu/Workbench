import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = store.getUserById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const roles = store.getRolesForUser(id);
  return NextResponse.json({ data: { ...user, roles } });
}