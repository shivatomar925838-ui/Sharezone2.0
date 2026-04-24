import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

console.log("Key format check:", supabaseKey.startsWith('eyJ') ? "Looks like a JWT" : "Does NOT look like a JWT");

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log("Testing Auth SignUp...");
  const { data, error } = await supabase.auth.signUp({
    email: 'test_error_check@example.com',
    password: 'password123'
  });
  
  if (error) {
    console.error("SignUp Error:", error.message, error.status, error.name);
  } else {
    console.log("SignUp successful", data);
  }
}

testAuth();
