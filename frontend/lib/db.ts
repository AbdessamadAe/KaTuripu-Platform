import { createClient } from '@supabase/supabase-js';
require('dotenv').config();

// Check if we're in a browser environment before using process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;