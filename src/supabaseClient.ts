import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Connection test for Supabase
supabase
  .from('vitals')
  .select('id')
  .limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection failed:', error.message);
    } else {
      console.log('Supabase connection successful!');
    }
  });
