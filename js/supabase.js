const SUPABASE_URL = 'https://hmajfzgdrlpycnncfrmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYWpmemdkcmxweWNubmNmcm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MDY2NjMsImV4cCI6MjA3MjE4MjY2M30.uvEANRFCC_M3uydwjc8zjZMHjK5m08o6FyXCn7p7zRA';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateUserId() {
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fingerprint = `${userAgent}-${screenRes}-${timezone}`;
    return btoa(fingerprint).slice(0, 32);
}

async function recordGhostSpook(id) {
    try {
        const userId = generateUserId();
        console.log('Attempting to record spook for id:', id);
        console.log('User ID:', userId);
        
        const { data, error } = await supabaseClient
            .from('spook_counts')
            .upsert({
                user_id: userId,
                id: id
            }, {
                onConflict: 'user_id,id'
            });
            
        if (error) {
            console.error('Supabase error recording ghost spook:', error);
            return false;
        }
        
        console.log('Ghost spook recorded successfully:', data);
        return true;
    } catch (error) {
        console.error('Network/connection error recording ghost spook:', error);
        console.log('This might be due to network issues or Supabase being unavailable');
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
        console.log('Testing Supabase connection...');
        const { data, error } = await supabaseClient
            .from('spook_counts')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('Supabase connection test failed:', error);
            return false;
        }
        
        console.log('Supabase connection successful!');
        return true;
    } catch (error) {
        console.error('Supabase connection test failed:', error);
        return false;
    }
}

export { recordGhostSpook, getSpookStats, testSupabaseConnection };
