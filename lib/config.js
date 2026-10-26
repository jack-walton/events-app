export function isAuthConfigured() {
  return Boolean(
    process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET && process.env.RESEND_API_KEY
  );
}
