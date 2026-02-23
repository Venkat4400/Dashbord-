import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Filters, Insight } from "@/hooks/useInsights";
import { getUniqueValues } from "@/hooks/useInsights";

interface FilterPanelProps {
  data: Insight[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const filterConfig: { key: keyof Filters; label: string; dataKey: keyof Insight }[] = [
  { key: "endYear", label: "End Year", dataKey: "end_year" },
  { key: "topic", label: "Topic", dataKey: "topic" },
  { key: "sector", label: "Sector", dataKey: "sector" },
  { key: "region", label: "Region", dataKey: "region" },
  { key: "pestle", label: "PEST", dataKey: "pestle" },
  { key: "source", label: "Source", dataKey: "source" },
  { key: "country", label: "Country", dataKey: "country" },
];

export function FilterPanel({ data, filters, onFilterChange }: FilterPanelProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() =>
              onFilterChange({ endYear: "", topic: "", sector: "", region: "", pestle: "", source: "", country: "", city: "" })
            }
          >
            <X className="w-3 h-3 mr-1" /> Clear all
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {filterConfig.map(({ key, label, dataKey }) => {
          const options = getUniqueValues(data, dataKey);
          return (
            <Select
              key={key}
              value={filters[key] || "all"}
              onValueChange={(val) =>
                onFilterChange({ ...filters, [key]: val === "all" ? "" : val })
              }
            >
              <SelectTrigger className="bg-secondary/50 border-border/50 text-sm h-9">
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">All {label}s</SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}
      </div>
    </div>
  );
}
