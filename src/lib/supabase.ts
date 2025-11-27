import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acblwzqhmwccuwfhdbum.supabase.co';
const supabaseAnonKey = 'sb_publishable_bvsw76lC8Gkw6AsAkE1b9A_8bnqA9df';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
