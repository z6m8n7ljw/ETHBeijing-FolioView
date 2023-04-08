import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/Card";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from "recharts";
import dayjs from "dayjs";
import useSWRMutation from "swr/mutation";
import MyRadioGroup from "@/components/RadioGroup";
import { formatUSD } from "@/lib/money-formatter";
import Loading from "@/components/Loading";
import { COIN_ID_MAP } from "@/lib/constants";

const modes = [
    {
        label: "Price",
        value: "price",
    },
    {
        label: "Market Cap",
        value: "marketCap",
    },
];

const shortcuts = ["24h", "7d", "14d", "30d", "90d", "180d", "1y"];
const getTimestampRange = (shortcut) => {
    // const num = shortcut.slice(0, -1);
    // const unit = shortcut.slice(-1);
    // const end = dayjs();
    // const start = end.subtract(num, unit);
    //
    // return [
    //   (start.valueOf() / 1000).toFixed(0),
    //   (end.valueOf() / 1000).toFixed(0),
    // ];
    const params = {
        '24h': { days: 1, interval: 'hourly' },
        '7d': { days: 7, interval: 'daily' },
        '14d': { days: 14, interval: 'daily' },
        '30d': { days: 30, interval: 'daily' },
        '90d': { days: 90, interval: 'daily' },
        '180d': { days: 180, interval: 'daily' },
        '1y': { days: 365, interval: 'daily' },
    }
    return params[shortcut];
};
const fetcher = (url, { arg }) => {
    return fetch(url + "?" + new URLSearchParams(arg)).then((res) => res.json());
};

const RangeChart = (props) => {
    const [mode, setMode] = useState(modes[0]);
    const [timeRangeShortcut, setTimeRangeShortcut] = useState(shortcuts[3]);
    const { chainid } = props;
    const {
        data: rangeData,
        trigger,
        isMutating,
    } = useSWRMutation(process.env.serverURL + "/coins/market_chart", fetcher);

    useEffect(() => {
        const params = getTimestampRange(timeRangeShortcut);
        if (chainid) {
            (async () => {
                try {
                    await trigger({
                        chainid: COIN_ID_MAP[chainid],
                        vs_currency: 'usd',
                        ...params
                    });
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [timeRangeShortcut, chainid]);

    const chartData = useMemo(() => {
        if (!rangeData) return [];
        console.log(rangeData)
        const { prices, market_caps, total_volumes } = rangeData;
        return prices.map((price, index) => {
            return {
                name: price[0],
                price: price[1],
                marketCap: market_caps[index][1],
                totalVolume: total_volumes[index][1],
            };
        });
    }, [rangeData]);

    return (
        <div className="col-span-2 grid-cols-2 gap-8">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <img
                        src={`/logos/${chainid}.png`}
                        className="h-8 w-8 rounded-full"
                        alt={chainid}
                    />
                    <span className="capitalize ml-4 text-2xl">{chainid}</span>
                </div>
                <div className="flex">
                    <div className="mr-4 min-w-[198px]">
                        <MyRadioGroup options={modes} value={mode} onChange={setMode} />
                    </div>
                    <div className="">
                        <MyRadioGroup
                            options={shortcuts}
                            value={timeRangeShortcut}
                            onChange={setTimeRangeShortcut}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8 relative">
                <Loading loading={isMutating} />
                <Card>
                    <div className="h-[32rem]">
                        <ResponsiveContainer width="100%" height="75%">
                            <AreaChart
                                width={500}
                                height={200}
                                data={chartData}
                                syncId="market_chart"
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid vertical={false} stroke={"rgb(240, 240, 240)"} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    mirror
                                    tickFormatter={(val) => formatUSD(val)}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const { name, payload: data = {} } = payload[0];
                                            const {
                                                name: timestamp,
                                                price,
                                                marketCap,
                                                totalVolume,
                                            } = data;
                                            return (
                                                <div
                                                    className="p-2 rounded-md border border-slate-300 bg-[rgba(255,255,255,.5)]">
                                                    <p className="text-lg">{dayjs(timestamp).format()}</p>
                                                    {name === "marketCap" ? (
                                                        <p className="mt-4">
                                                            <span className="text-lg capitalize">
                                                                Market Cap:{" "}
                                                            </span>
                                                            <span>{formatUSD(marketCap)}</span>
                                                        </p>
                                                    ) : (
                                                            <p className="mt-4">
                                                                <span className="text-lg capitalize">
                                                                    Price:{" "}
                                                                </span>
                                                                <span>{formatUSD(price)}</span>
                                                            </p>
                                                        )}
                                                    <p className="desc">
                                                        <span className="text-lg">Vol: </span>
                                                        <span>{formatUSD(totalVolume)}</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return <span>123</span>;
                                    }}
                                    cursor={{ stroke: "#d8d8d8", strokeWidth: 2 }}
                                />
                                <Area
                                    dataKey={mode.value}
                                    stroke="#4a6be5"
                                    fill="#f6f6ff"
                                    type={"linear"}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height="25%">
                            <BarChart
                                width={500}
                                height={200}
                                data={chartData}
                                syncId="market_chart"
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis
                                    dataKey="name"
                                    tickFormatter={(timestamp) => {
                                        if (timeRangeShortcut === "24h") {
                                            return dayjs(timestamp).format("h:mm A");
                                        }
                                        return dayjs(timestamp).format("DD[.]MMM");
                                    }}
                                />
                                <Tooltip
                                    content={() => null}
                                    cursor={{ stroke: "#f1f1f1", strokeWidth: 1, y: 0 }}
                                />
                                <Bar dataKey="totalVolume" stroke="#4a6be5" fill="#f6f6ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RangeChart;
