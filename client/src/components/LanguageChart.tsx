import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa"];

interface LanguageData {
  name: string;
  value: number;
}

const LanguageChart = ({ data }: { data: LanguageData[] }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 12,
              color: "rgba(241,245,249,0.95)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LanguageChart;