/**
 * Browser fetch for authenticated editor API routes.
 * Sends Clerk session cookies (same-origin) so routes using isRouteAuthorized work in production.
 */
export function apiFetch(input, init = {}) {
  return fetch(input, {
    credentials: "same-origin",
    ...init,
  });
}
