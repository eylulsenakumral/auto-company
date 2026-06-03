/**
 * Supabase Client Configuration
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Real-time subscription helper
 */
export const subscribeToProspects = (callback) => {
  return supabase
    .channel('prospects_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'prospects' }, callback)
    .subscribe();
};

export const subscribeToCalls = (callback) => {
  return supabase
    .channel('calls_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'calls' }, callback)
    .subscribe();
};
