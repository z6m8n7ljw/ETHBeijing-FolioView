import React, {useMemo} from "react";
import Card from "@/components/Card";
import {
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area
} from "recharts";
import {useSelector} from "react-redux";
import clsx from "clsx";
import Link from "next/link";
import {format} from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const COLOR_MAP = {
  ethereum: "#627eea",
  polygon: "#8247e5",
  bsc: "#f3ba2f",
  solana: "#aa4fe8",
};

function AssetItems() {
  const assetInWallet = useSelector((state) => state.asset.assetInWallet);
  const chainidList = useSelector((state) =>
    state.asset.selectedChains.map((item) => item.name)
  );

  const data = useMemo(() => {
    const vals = Object.values(assetInWallet);
    if (!chainidList.length || !vals.length) return [];
    const timestamps = vals[0].map((item) => item.timestamp);
    return chainidList.map((chainid) =>
      timestamps.map((timestamp, i) => ({
        name: timestamp,
        value: vals.reduce((acc, cur) => acc + (cur[i][chainid] || 0), 0),
      }))
    );
  }, [chainidList, assetInWallet]);

  const sums = useMemo(() => {
    return Object.values(assetInWallet).reduce((acc, cur) => [...acc, ...cur], []).reduce((acc, cur) => {
      return {
        bsc: acc.bsc + (cur.bsc || 0),
        ethereum: acc.ethereum + (cur.ethereum || 0),
        polygon: acc.polygon + (cur.polygon || 0),
        solana: acc.solana + (cur.solana || 0),
      }
    }, {
      bsc: 0, ethereum: 0, polygon: 0, solana: 0
    })
  }, [assetInWallet]);

  if (!chainidList.length || !data.length) return <div></div>;

  return sums && chainidList.map((chainid, index) => {
    // console.log(data[index])
    const containerClass = clsx({
      "mt-8": index !== 0,
    });
    if (sums[chainid] > 0) {
      return (
        <Card
          title={chainid}
          key={index}
          containerClass={containerClass}
          extra={
            <Link href={`/detail/${chainid}`}>
              <span className="text-[#2e70e3]">View more</span>
            </Link>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={200}
                data={data[index]}
                syncId="anyId"
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} stroke={"#eceef4"}/>
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
                <Tooltip/>
                <Line
                  strokeWidth={"2px"}
                  type="monotone"
                  dataKey="value"
                  dot={false}
                  stroke={COLOR_MAP[chainid] || COLORS[i]}
                />
                <Area
                  dataKey="total"
                  stroke={COLOR_MAP[chainid] || COLORS[i]}
                  fill={COLOR_MAP[chainid] || COLORS[i]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      );
    }
  });
}

export default AssetItems;
