import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ALL_PERMISSIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: store.getAllRoles() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    if (body.name.trim().length > 64) return NextResponse.json({ error: "Role name must be 64 characters or fewer" }, { status: 400 });
    if (!body.description?.trim()) return NextResponse.json({ error: "Role description is required" }, { status: 400 });
    if (!Array.isArray(body.permissions)) return NextResponse.json({ error: "Permissions must be an array" }, { status: 400 });

    const invalid = body.permissions.filter((p: unknown) => typeof p !== "string" || !ALL_PERMISSIONS.includes(p));
    if (invalid.length > 0) return NextResponse.json({ error: `Invalid permissions: ${invalid.join(", ")}` }, { status: 400 });

    const existing = store.getAllRoles();
    if (existing.some((r) => r.name.toLowerCase() === body.name.trim().toLowerCase())) {
      return NextResponse.json({ error: "A role with this name already exists" }, { status: 409 });
    }

    const role = store.createRole({ name: body.name, description: body.description, permissions: body.permissions, color: body.color });
    return NextResponse.json({ data: role }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}