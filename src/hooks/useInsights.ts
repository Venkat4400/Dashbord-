import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Insight {
  id: number;
  end_year: string;
  intensity: number;
  sector: string;
  topic: string;
  insight: string;
  url: string;
  region: string;
  start_year: string;
  impact: string;
  added: string;
  published: string;
  country: string;
  relevance: number;
  pestle: string;
  source: string;
  title: string;
  likelihood: number;
}

export interface Filters {
  endYear: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  country: string;
  city: string;
}

const defaultFilters: Filters = {
  endYear: "",
  topic: "",
  sector: "",
  region: "",
  pestle: "",
  source: "",
  country: "",
  city: "",
};

async function fetchInsights(): Promise<Insight[]> {
  // Fetch all data (may need multiple queries for >1000 rows)
  let allData: Insight[] = [];
  let from = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .range(from, from + pageSize - 1);
    
    if (error) throw error;
    if (!data || data.length === 0) break;
    allData = [...allData, ...data as Insight[]];
    if (data.length < pageSize) break;
    from += pageSize;
  }
  
  return allData;
}

async function seedDataIfNeeded() {
  const { count } = await supabase.from("insights").select("*", { count: "exact", head: true });
  if (count && count > 0) return;

  // Fetch JSON and seed via edge function
  const res = await fetch("/data/jsondata.json");
  const jsonData = await res.json();
  
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  await fetch(`https://${projectId}.supabase.co/functions/v1/seed-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: jsonData }),
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      await seedDataIfNeeded();
      return fetchInsights();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function applyFilters(data: Insight[], filters: Filters): Insight[] {
  return data.filter((item) => {
    if (filters.endYear && item.end_year !== filters.endYear) return false;
    if (filters.topic && item.topic !== filters.topic) return false;
    if (filters.sector && item.sector !== filters.sector) return false;
    if (filters.region && item.region !== filters.region) return false;
    if (filters.pestle && item.pestle !== filters.pestle) return false;
    if (filters.source && item.source !== filters.source) return false;
    if (filters.country && item.country !== filters.country) return false;
    return true;
  });
}

export function getUniqueValues(data: Insight[], key: keyof Insight): string[] {
  const values = data
    .map((d) => String(d[key]))
    .filter((v) => v && v.trim() !== "");
  return [...new Set(values)].sort();
}

export { defaultFilters };
