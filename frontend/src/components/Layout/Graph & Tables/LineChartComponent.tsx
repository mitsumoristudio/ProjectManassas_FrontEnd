
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type DataPoint = { name: string; value: number };

interface Props {
    data: DataPoint[];
    color?: string;
}

export const LineChartComponent: React.FC<Props> = ({ data, color = "#3b82f6" }) => {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


