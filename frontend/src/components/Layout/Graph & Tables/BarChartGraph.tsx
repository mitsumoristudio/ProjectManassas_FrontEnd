
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface BarChartComponentProps {
    data: { name: string; estimate: number }[];
    title?: string;
}

export const BarChartGraph: React.FC<BarChartComponentProps> = ({ data, title }) => {
    return (
        <div className="bg-[#101010] border border-gray-800 rounded-lg p-8 my-8">
            {title && <h2 className="text-xl font-semibold py-2 text-white mb-4">{title}</h2>}
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="150%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={140}

                        />
                        <YAxis tick={{ fill: "#9CB3AF" }} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="estimate" fill="#6366C1" radius={[8, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

