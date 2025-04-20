'use client'

import { createBrowserClient } from '@supabase/ssr'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';


const createClientForBrowser = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  )

export default createClientForBrowser