import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";
import Card from "@/components/Card";
import { useSelector } from "react-redux";
import clsx from 'clsx';
import styles from '@/styles/page/TotalAssets.module.css';
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function TotalAssets(props) {
  const assetInWallet = useSelector((state) => state.asset.assetInWallet);

  const chainidList = useSelector((state) =>
    state.asset.selectedChains.map((item) => item.name)
  );

  const data = useMemo(() => {
    const vals = Object.values(assetInWallet);
    if (!chainidList.length || !vals.length) return [];
    const timestamps = vals[0].map((item) => item.timestamp);

    return timestamps.map((name, i) =>
      vals.reduce(
        (acc, assetItem) => {
          chainidList.forEach(
            (chainid) => (acc.total += assetItem[i][chainid] || 0)
          );
          return acc;
        },
        { name, total: 0 }
      )
    );
  }, [chainidList, assetInWallet]);

  const lastOneTotal = useMemo(() => data && data.length > 0 ? data[0].total : 0, [data])
  const lastOnePercent = useMemo(() => {
    if (data && data.length > 0) {
      const dotNum = (data[data.length - 1]?.total / data[data.length - 2]?.total).toFixed(4);
      return (dotNum * 100 - 100).toFixed(2);
    }

    return 0;
  }, [data]);

  const colorCls = lastOnePercent > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card title="Total value of the assets" childrenClass={styles.inner}>
      <>
        <h4 className={styles.txtWrap}>
          <span className={styles.total}>${lastOneTotal}</span>
          <span className={clsx(styles.downArrow, colorCls, {
            [styles.upBg]: lastOnePercent > 0
          })}>{lastOnePercent > 0 ? '↑' : '↓'}</span>
          <span className={clsx(styles.rate, colorCls)}>{lastOnePercent}%</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={200}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke={"#eceef4"} />
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
                tickFormatter={(str) => `$${str}`}
              />
              <Tooltip />
              <Area
                dataKey="total"
                stroke="#4a6be5"
                strokeWidth="4px"
                fill="rgba(235, 236, 255, 0.48)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </>
    </Card>
  );
}

export default TotalAssets;
