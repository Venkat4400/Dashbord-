import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap,
} from "recharts";
import type { Insight } from "@/hooks/useInsights";
import { useMemo } from "react";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(28, 90%, 55%)",
  "hsl(199, 70%, 60%)",
  "hsl(28, 80%, 65%)",
  "hsl(199, 60%, 40%)",
  "hsl(28, 70%, 45%)",
  "hsl(199, 50%, 55%)",
  "hsl(28, 60%, 58%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(214, 20%, 88%)",
  borderRadius: "8px",
  color: "hsl(220, 25%, 15%)",
  fontSize: "12px",
};

interface ChartsProps {
  data: Insight[];
}

function groupBy(data: Insight[], key: keyof Insight, valueKey: keyof Insight) {
  const map: Record<string, { sum: number; count: number }> = {};
  data.forEach((d) => {
    const k = String(d[key]) || "Unknown";
    if (!k.trim()) return;
    if (!map[k]) map[k] = { sum: 0, count: 0 };
    map[k].sum += Number(d[valueKey]) || 0;
    map[k].count++;
  });
  return Object.entries(map)
    .map(([name, { sum, count }]) => ({ name, value: +(sum / count).toFixed(1), count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
}

function countBy(data: Insight[], key: keyof Insight) {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const k = String(d[key]) || "";
    if (!k.trim()) return;
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

export function IntensityBySectorChart({ data }: ChartsProps) {
  const chartData = useMemo(() => groupBy(data, "sector", "intensity"), [data]);
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Avg Intensity by Sector</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 45%)" }} angle={-35} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 45%)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopicsDistributionChart({ data }: ChartsProps) {
  const chartData = useMemo(() => countBy(data, "topic"), [data]);
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Top Topics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegionAreaChart({ data }: ChartsProps) {
  const chartData = useMemo(() => groupBy(data, "region", "relevance"), [data]);
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Avg Relevance by Region</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ left: -10 }}>
          <defs>
            <linearGradient id="colorRelevance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 45%)" }} angle={-35} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 45%)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke="hsl(199, 89%, 48%)" fill="url(#colorRelevance)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PestleRadarChart({ data }: ChartsProps) {
  const chartData = useMemo(() => groupBy(data, "pestle", "likelihood"), [data]);
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Likelihood by PESTLE</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="hsl(214, 20%, 88%)" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 45%)" }} />
          <PolarRadiusAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 45%)" }} />
          <Radar dataKey="value" stroke="hsl(28, 90%, 55%)" fill="hsl(28, 90%, 55%)" fillOpacity={0.3} strokeWidth={2} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CountryBarChart({ data }: ChartsProps) {
  const chartData = useMemo(() => countBy(data, "country"), [data]);
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "600ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Top Countries by Records</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215, 15%, 45%)" }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(215, 15%, 45%)" }} width={120} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTreemapContent(props: any) {
  const { x, y, width, height, name, fill } = props;
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} opacity={0.85} />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={10} fontWeight={500}>
        {String(name).slice(0, 12)}
      </text>
    </g>
  );
}

export function SourceTreemap({ data }: ChartsProps) {
  const chartData = useMemo(() => countBy(data, "source").map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] })), [data]);
  return (
    <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "700ms" }}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Sources Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={chartData}
          dataKey="value"
          nameKey="name"
          stroke="hsl(214, 20%, 88%)"
          content={<CustomTreemapContent />}
        />
      </ResponsiveContainer>
    </div>
  );
}
