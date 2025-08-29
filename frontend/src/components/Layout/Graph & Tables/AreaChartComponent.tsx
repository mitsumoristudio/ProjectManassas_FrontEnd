import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {motion} from 'framer-motion';

type DataPoint = { name: string; value: number };

interface Props {
    data: DataPoint[];
    color?: string;
}

export const AreaChartComponent: React.FC<Props> = ({data, color = "#8B5CF6"}) => {
    return (
        <motion.div
                className={"bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700 mb-8"}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
        >
            <div className={"flex items-center justify-between mb-6"}>
                <h2 className={"text-xl font-semibold text-gray-100"}>Project Overview</h2>
            </div>

        <div className={"w-full h-80"}>
            <ResponsiveContainer>
                <AreaChart data={data} >
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='month' stroke='#9CA3AF' />
                    <YAxis stroke='#9CA3AF' />
                    <Tooltip
                        contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                        itemStyle={{ color: "#E5E7EB" }}
                    />
                    <Area type='monotone' dataKey='sales' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        </motion.div>

    )
}