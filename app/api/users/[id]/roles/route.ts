import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.roleId || typeof body.roleId !== "string") {
      return NextResponse.json({ error: "roleId is required" }, { status: 400 });
    }
    const { user, error } = store.assignRole(id, body.roleId);
    if (error || !user) {
      return NextResponse.json({ error: error ?? "Assignment failed" }, { status: 404 });
    }
    const roles = store.getRolesForUser(id);
    return NextResponse.json({ data: { ...user, roles } });
  } catch {
    return NextResponse.json({ error: "Failed to assign role" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.roleId || typeof body.roleId !== "string") {
      return NextResponse.json({ error: "roleId is required" }, { status: 400 });
    }
    const { user, error } = store.unassignRole(id, body.roleId);
    if (error || !user) {
      return NextResponse.json({ error: error ?? "Unassignment failed" }, { status: 404 });
    }
    const roles = store.getRolesForUser(id);
    return NextResponse.json({ data: { ...user, roles } });
  } catch {
    return NextResponse.json({ error: "Failed to unassign role" }, { status: 500 });
  }
}