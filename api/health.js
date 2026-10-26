import { isAuthConfigured } from "../lib/config.js";

export function GET() {
  return Response.json({
    ok: true,
    authConfigured: isAuthConfigured()
  });
}
