import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ALL_PERMISSIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const role = store.getRoleById(id);
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });
  const users = store.getUsersForRole(id);
  return NextResponse.json({ data: { ...role, userCount: users.length } });
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const role = store.getRoleById(id);
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

    const body = await request.json();
    if (body.name !== undefined) {
      if (!body.name?.trim()) return NextResponse.json({ error: "Role name cannot be empty" }, { status: 400 });
      if (body.name.trim().length > 64) return NextResponse.json({ error: "Role name must be 64 characters or fewer" }, { status: 400 });
      const existing = store.getAllRoles();
      if (existing.some((r) => r.id !== id && r.name.toLowerCase() === body.name.trim().toLowerCase())) {
        return NextResponse.json({ error: "A role with this name already exists" }, { status: 409 });
      }
    }
    if (body.permissions !== undefined) {
      if (!Array.isArray(body.permissions)) return NextResponse.json({ error: "Permissions must be an array" }, { status: 400 });
      const invalid = body.permissions.filter((p: unknown) => typeof p !== "string" || !ALL_PERMISSIONS.includes(p));
      if (invalid.length > 0) return NextResponse.json({ error: `Invalid permissions: ${invalid.join(", ")}` }, { status: 400 });
    }

    const updated = store.updateRole(id, { name: body.name, description: body.description, permissions: body.permissions, color: body.color });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const result = store.deleteRole(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.error === "Role not found" ? 404 : 403 });
  }
  return NextResponse.json({ data: { success: true } });
}