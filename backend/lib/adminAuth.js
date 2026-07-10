const { supabase } = require('./supabase');

// Real admin auth: the frontend signs in via Supabase Auth (email+password) and sends the
// resulting JWT as `Authorization: Bearer <token>`. We verify the token with Supabase, then
// check the user's email against an allowlist — this replaces the old shared ADMIN_API_KEY,
// so each admin has their own login (and can be individually revoked in the Supabase dashboard
// under Authentication → Users, without rotating a secret everyone else also uses).
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function requireAdmin(req, res, next) {
  const authHeader = req.header('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization: Bearer <token> header' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session — please log in again' });
  }

  const email = (data.user.email || '').toLowerCase();
  if (!ADMIN_EMAILS.includes(email)) {
    console.warn(`[adminAuth] rejected non-admin user: ${email}`);
    return res.status(403).json({ error: 'This account is not authorized for admin access' });
  }

  req.adminUser = { id: data.user.id, email };
  next();
}

module.exports = { requireAdmin };
