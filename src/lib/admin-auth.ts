import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function getAdminUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(request: NextRequest) {
  const user = getAdminUser(request);
  if (!user) return null;
  return user;
}

export function requireRole(request: NextRequest, role: "ADMIN" | "STAFF") {
  const user = getAdminUser(request);
  if (!user) return null;
  if (role === "ADMIN" && user.role !== "ADMIN") return null;
  return user;
}
