'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

export default function AnalysisPage() {
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      day,
      appointments: Math.floor(Math.random() * 10) + 1,
    }));
  }, []);

  const statusData = useMemo(() => {
    return [
      { name: 'Completed', value: Math.floor(Math.random() * 30) + 10 },
      { name: 'Pending', value: Math.floor(Math.random() * 15) + 5 },
      { name: 'Cancelled', value: Math.floor(Math.random() * 8) + 1 },
    ];
  }, []);

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📊 Analysis</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Appointments This Week
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Appointment Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Note: This data is currently randomly generated for demonstration purposes.
      </p>
    </div>
  );
}