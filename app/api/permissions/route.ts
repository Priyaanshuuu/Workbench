import { NextResponse } from "next/server";
import { RESOURCES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const grouped = RESOURCES.map((resource) => ({
    resource: resource.key,
    label: resource.label,
    description: resource.description,
    permissions: resource.actions.map((action) => ({
      permission: action.permission,
      action: action.key,
      label: action.label,
      description: action.description,
    })),
  }));
  return NextResponse.json({ data: grouped });
}