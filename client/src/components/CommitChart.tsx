import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface CommitData {
  date: string;
  count: number;
}

const CommitChart = ({ data }: { data: CommitData[] }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
            tickLine={{ stroke: "rgba(148,163,184,0.2)" }}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
            tickLine={{ stroke: "rgba(148,163,184,0.2)" }}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 12,
              color: "rgba(241,245,249,0.95)",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommitChart;