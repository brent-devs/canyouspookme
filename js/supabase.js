const SUPABASE_URL = 'https://hmajfzgdrlpycnncfrmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYWpmemdkcmxweWNubmNmcm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MDY2NjMsImV4cCI6MjA3MjE4MjY2M30.uvEANRFCC_M3uydwjc8zjZMHjK5m08o6FyXCn7p7zRA';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }

async function recordGhostSpook(ghostId) {
    try {
        const userId = generateUserId();

        const { error: insertError } = await supabaseClient
            .from('spooks')
            .insert({
                ghost_id: ghostId,
                user_id: userId
            });

        if (insertError) {
            console.error('Error inserting spook event:', insertError);
        }

        const { data, error: rpcError } = await supabaseClient
            .rpc('increment_spook_summary', {
                ghost_id_input: ghostId,
                user_id_input: userId
            });

        if (rpcError) {
            console.error('Error updating spook summary:', rpcError);
            return false;
        }
        return true;

    } catch (error) {
        console.error('Network/connection error recording ghost spook:', error);
        return false;
    }
}

async function getSpookStats() {
    try {
        const { data, error } = await supabaseClient
            .from('spook_counts')
            .select('*');
            
        if (error) {
            console.error('Error fetching spook stats:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Failed to fetch spook stats:', error);
        return null;
    }
}

async function testSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('spook_counts')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('Connection test failed:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
}

export { recordGhostSpook, getSpookStats, testSupabaseConnection };
