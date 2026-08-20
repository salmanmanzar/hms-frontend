'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Info, Sparkles, TrendingUp } from 'lucide-react';

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

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-700 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-blue-600/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 mb-3 border border-white/15">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Practice Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clinical Insights & Analytics</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Visual breakdown of weekly appointment volume and consultation fulfillment status.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Appointments This Week */}
        <div className="bg-white p-6 rounded-3xl shadow-xs ring-1 ring-slate-100 border border-slate-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Appointments This Week</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Daily consultation volume</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              7 Days
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="appointments" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl shadow-xs ring-1 ring-slate-100 border border-slate-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-teal-600" />
                <span>Status Breakdown</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Proportion of consultation outcomes</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-600">
              Overview
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Demo Disclaimer */}
      <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/50 text-slate-500 text-xs max-w-lg mx-auto">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span>Note: Data shown above is generated for analytical visualization and demonstration purposes.</span>
      </div>
    </div>
  );
}