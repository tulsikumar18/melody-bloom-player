
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://yyjsfopaebnuaupynoxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5anNmb3BhZWJudWF1cHlub3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Nzg1NDksImV4cCI6MjA1NjI1NDU0OX0.kxiXcAFBDY7NdFjOwUhONrBSWUaKtuk4ljMPpQdw2QI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
