import React, { useMemo } from "react";
import Card from "@/components/Card";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import styles from './Proportion.module.css';
import clsx from "clsx";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const COLOR_MAP = {
  ethereum: "#627eea",
  polygon: "#8247e5",
  bsc: "#f3ba2f",
  solana: "#aa4fe8",
};

function Proportion() {
  const realtimeAsset = useSelector((state) => state.asset.realtimeAsset);
  const chainidList = useSelector((state) =>
    state.asset.selectedChains.map((item) => item.name)
  );
  const data = useMemo(() => {
    const vals = Object.values(realtimeAsset);
    if (!chainidList.length || !vals.length) return [];
    const list = chainidList.map((name) =>
      vals.reduce(
        (acc, cur) => ({
          ...acc,
          value: acc.value + (cur[name] || 0),
        }),
        { name, value: 0 }
      )
    );

    let total = 0,
      beforeLast = 0;

    list.forEach(x => {
      total += x.value;
    });

    return list.map((x, index) => {
      const percent = Math.ceil((x.value / total).toFixed(2) * 100);

      if (index !== list.length - 1) {
        beforeLast += percent;
      }

      return (
        {
          ...x,
          percent: index === list.length - 1 ? (100 - beforeLast) : percent
        }
      )
    });
  }, [chainidList, realtimeAsset]);


  return (
    <Card title="token propotion">
      <div className="h-64" style={{ height: '19rem' }}>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart width={"100%"} height={"100%"}>
            <Pie
              data={data.filter(d => d.value > 0)}
              cx={"50%"}
              cy={"50%"}
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
              animationDuration={300}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLOR_MAP[entry.name] || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <ul className={styles.list}>
          {data.map((x, index) => (
            x.value > 0 && <li key={index} className={clsx(styles.item, styles[x.name])}>{x.name}: {x.percent}%</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default Proportion;
