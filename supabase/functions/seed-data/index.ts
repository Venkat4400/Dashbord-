import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if data already exists
    const { count } = await supabase.from('insights').select('*', { count: 'exact', head: true });
    if (count && count > 0) {
      return new Response(JSON.stringify({ message: `Data already seeded (${count} rows)` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: jsonData } = await req.json();

    // Insert in batches of 500
    const batchSize = 500;
    let inserted = 0;
    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize).map((item: any) => ({
        end_year: item.end_year || '',
        intensity: item.intensity || 0,
        sector: item.sector || '',
        topic: item.topic || '',
        insight: item.insight || '',
        url: item.url || '',
        region: item.region || '',
        start_year: item.start_year || '',
        impact: item.impact || '',
        added: item.added || '',
        published: item.published || '',
        country: item.country || '',
        relevance: item.relevance || 0,
        pestle: item.pestle || '',
        source: item.source || '',
        title: item.title || '',
        likelihood: item.likelihood || 0,
      }));

      const { error } = await supabase.from('insights').insert(batch);
      if (error) throw error;
      inserted += batch.length;
    }

    return new Response(JSON.stringify({ message: `Seeded ${inserted} rows` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
