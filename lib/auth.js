import { auth, currentUser } from "@clerk/nextjs/server";

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
  if (!["editor","admin"].includes(role)) {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }
  return { userId, role };
}
