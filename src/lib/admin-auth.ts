import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export function getAdminUser(request?: NextRequest) {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get("admin_token")?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(request?: NextRequest) {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get("admin_token")?.value;
  } else {
    // Use next/headers cookies() for route handlers without request param
    const cookieStore = await cookies();
    token = cookieStore.get("admin_token")?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function requireRole(role: "ADMIN" | "STAFF", request?: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return null;
  if (role === "ADMIN" && user.role !== "ADMIN") return null;
  return user;
}
