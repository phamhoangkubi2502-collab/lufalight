const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[lufalight-backend] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — DB calls will fail until .env is configured.');
}

// Service-role key bypasses RLS. This client must NEVER be exposed to the browser —
// it only ever runs inside this backend process.
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

module.exports = { supabase };
