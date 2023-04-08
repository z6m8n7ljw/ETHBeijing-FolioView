import React, { useMemo } from "react";
import Card from "@/components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const COLOR_MAP = {
  ethereum: "#627eea",
  polygon: "#8247e5",
  bsc: "#f3ba2f",
  solana: "#aa4fe8",
};

function Cumulative() {
  const cumulative = useSelector((state) => state.asset.cumulativePL);

  const data = useMemo(() => {
    const vals = Object.values(cumulative);
    if (!vals.length) return [];
    const timestamps = vals[0].map((item) => item.timestamp);

    return timestamps.map((name, i) =>
      vals.reduce(
        (acc, assetItem) => {
          acc = {
            ...acc,
            total: assetItem[i].value || 0,
          };
          return acc;
        },
        { name, total: 0 }
      )
    );
  }, [cumulative]);

  return (
    <Card title="Cumulative p&l">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              stroke="#BDBEC3"
              dataKey="name"
              tick={{
                fontSize: '13px',
                fill: '#BDBEC4'
              }}
              tickFormatter={(str) => format(new Date(str), 'MMM d')}
            />
            <YAxis
              stroke='#BDBEC3'
              tick={{
                fontSize: '12px',
                fill: '#BDBEC4'
              }}
              tickLine={{
                stroke: '#BDBEC3'
              }}
            />
            <Tooltip />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default Cumulative;
