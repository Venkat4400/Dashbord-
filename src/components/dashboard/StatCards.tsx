import { Activity, TrendingUp, Target, Zap } from "lucide-react";
import type { Insight } from "@/hooks/useInsights";

interface StatCardsProps {
  data: Insight[];
}

export function StatCards({ data }: StatCardsProps) {
  const avgIntensity = data.length ? (data.reduce((s, d) => s + d.intensity, 0) / data.length).toFixed(1) : "0";
  const avgLikelihood = data.length ? (data.reduce((s, d) => s + d.likelihood, 0) / data.length).toFixed(1) : "0";
  const avgRelevance = data.length ? (data.reduce((s, d) => s + d.relevance, 0) / data.length).toFixed(1) : "0";
  const totalRecords = data.length;

  const stats = [
    { label: "Avg Intensity", value: avgIntensity, icon: Zap, color: "text-chart-1" },
    { label: "Avg Likelihood", value: avgLikelihood, icon: TrendingUp, color: "text-chart-2" },
    { label: "Avg Relevance", value: avgRelevance, icon: Target, color: "text-chart-3" },
    { label: "Total Records", value: totalRecords.toLocaleString(), icon: Activity, color: "text-chart-4" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="glass-card p-5 stat-glow animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
