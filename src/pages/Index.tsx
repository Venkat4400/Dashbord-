import { useState } from "react";
import { useInsights, applyFilters, defaultFilters, type Filters } from "@/hooks/useInsights";
import { StatCards } from "@/components/dashboard/StatCards";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import {
  IntensityBySectorChart,
  TopicsDistributionChart,
  RegionAreaChart,
  PestleRadarChart,
  CountryBarChart,
  SourceTreemap,
} from "@/components/dashboard/Charts";
import { BarChart3, Loader2 } from "lucide-react";

const Index = () => {
  const { data: rawData, isLoading, error } = useInsights();
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const data = rawData ? applyFilters(rawData, filters) : [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Error loading data: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Insights Dashboard</h1>
          <p className="text-sm text-muted-foreground">Data visualization & analytics</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterPanel data={rawData || []} filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatCards data={data} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <IntensityBySectorChart data={data} />
        <TopicsDistributionChart data={data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <RegionAreaChart data={data} />
        <PestleRadarChart data={data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CountryBarChart data={data} />
        <SourceTreemap data={data} />
      </div>
    </div>
  );
};

export default Index;
