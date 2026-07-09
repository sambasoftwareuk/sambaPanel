import { auth, currentUser, getAuth } from "@clerk/nextjs/server";

/**
 * Route handler auth: Clerk session only.
 * Use on PATCH/POST/DELETE API routes called from the editor UI.
 *
 * - Signed-in Clerk user → allowed (Save All from the browser)
 * - No session → 401 Unauthorized
 */
export function isRouteAuthorized(req) {
  const { userId } = getAuth(req);
  if (userId) return true;
}

export async function requireSignedIn() {
  const { userId } = auth();
  if (!userId) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  return userId;
}

// İstersen rol kontrolü (Clerk publicMetadata.role = 'editor' | 'admin')
export async function requireEditor() {
  const { userId } = auth();
  if (!userId) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  const u = await currentUser();
  const role = u?.publicMetadata?.role;
  if (!["editor", "admin"].includes(role)) {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }
  return { userId, role };
}
