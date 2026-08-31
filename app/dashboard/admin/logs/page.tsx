'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { decodeToken } from '@/lib/jwt';
import {
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  Pill,
  UserPlus,
  LogIn,
  Lock,
  Filter,
  RefreshCw,
  AlertCircle,
  Building2,
  Clock,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
interface AuditLog {
  id: string;
  organizationId: string;
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  targetId?: string;
  targetName?: string;
  targetRole?: string;
  action: string;
  metadata?: { email?: string };
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────
const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; colorClass: string; bg: string }
> = {
  STAFF_INVITED: {
    label: 'Staff Invited',
    icon: UserPlus,
    colorClass: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
  },
  STAFF_JOINED: {
    label: 'Staff Joined',
    icon: LogIn,
    colorClass: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
  },
};

const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  doctor: { label: 'Doctor', icon: Stethoscope, color: 'bg-blue-100 text-blue-700' },
  receptionist: { label: 'Receptionist', icon: ClipboardList, color: 'bg-teal-100 text-teal-700' },
  pharmacist: { label: 'Pharmacist', icon: Pill, color: 'bg-emerald-100 text-emerald-700' },
  admin: { label: 'Admin', icon: ShieldCheck, color: 'bg-amber-100 text-amber-700' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function RoleBadge({ role }: { role?: string }) {
  if (!role) return null;
  const cfg = ROLE_CONFIG[role] ?? { label: role, icon: ShieldCheck, color: 'bg-slate-100 text-slate-600' };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filtered, setFiltered] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    const decoded = decodeToken(token);
    if (decoded?.role !== 'admin') { router.push('/login'); return; }
    fetchLogs();
  }, []);

  // Filter
  useEffect(() => {
    let data = [...logs];
    if (roleFilter !== 'all') data = data.filter(l => l.targetRole === roleFilter);
    if (actionFilter !== 'all') data = data.filter(l => l.action === actionFilter);
    setFiltered(data);
  }, [logs, roleFilter, actionFilter]);

  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data: AuditLog[] = await apiRequest('/audit-log/organization');
      setLogs(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <Lock className="w-4.5 h-4.5 text-white" />
            </div>
            Activity Logs
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 max-w-lg">
            Immutable audit trail of all staff activity. Records cannot be edited or deleted.
          </p>
        </div>

        {/* Immutable badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-emerald-700">Tamper-proof &amp; Immutable</span>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Events', value: logs.length, icon: Clock, color: 'from-slate-50 to-blue-50/40 text-blue-600' },
            { label: 'Invitations', value: logs.filter(l => l.action === 'STAFF_INVITED').length, icon: UserPlus, color: 'from-slate-50 to-indigo-50/40 text-indigo-600' },
            { label: 'Joinings', value: logs.filter(l => l.action === 'STAFF_JOINED').length, icon: LogIn, color: 'from-slate-50 to-emerald-50/40 text-emerald-600' },
            { label: 'Doctors', value: logs.filter(l => l.targetRole === 'doctor').length, icon: Stethoscope, color: 'from-slate-50 to-teal-50/40 text-teal-600' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-gradient-to-br ${s.color.split(' text')[0]} border border-slate-100 rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                  <Icon className={`w-4 h-4 ${s.color.split(' ').pop()}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Filters ─── */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-100 p-3 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />

        {/* Role filter */}
        <select
          id="role-filter"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
        >
          <option value="all">All Roles</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
          <option value="pharmacist">Pharmacist</option>
          <option value="admin">Admin</option>
        </select>

        {/* Action filter */}
        <select
          id="action-filter"
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
        >
          <option value="all">All Actions</option>
          <option value="STAFF_INVITED">Staff Invited</option>
          <option value="STAFF_JOINED">Staff Joined</option>
        </select>

        <span className="ml-auto text-xs text-slate-400 font-medium">
          Showing {filtered.length} of {logs.length} events
        </span>

        {/* Refresh */}
        <button
          id="refresh-logs-btn"
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* ─── Loading skeleton ─── */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-slate-100 rounded" />
                <div className="h-3 w-2/3 bg-slate-100 rounded" />
              </div>
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* ─── Log Timeline ─── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No audit logs found for the selected filters.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-slate-100 z-0" />

          <div className="space-y-3">
            {filtered.map((log) => {
              const actionCfg = ACTION_CONFIG[log.action] ?? {
                label: log.action,
                icon: Clock,
                colorClass: 'text-slate-500',
                bg: 'bg-slate-50 border-slate-200',
              };
              const ActionIcon = actionCfg.icon;

              return (
                <div
                  key={log.id}
                  className="relative z-10 flex items-start gap-4 bg-white rounded-2xl border border-slate-100 px-4 py-4 shadow-xs hover:shadow-sm hover:border-slate-200 transition-all duration-150"
                >
                  {/* Action icon */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${actionCfg.bg}`}>
                    <ActionIcon className={`w-4.5 h-4.5 ${actionCfg.colorClass}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${actionCfg.colorClass}`}>
                        {actionCfg.label}
                      </span>
                      {log.targetRole && <RoleBadge role={log.targetRole} />}
                    </div>

                    {/* Target — who it happened TO */}
                    {log.targetName && (
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {log.targetName}
                        {log.metadata?.email && (
                          <span className="ml-1.5 text-xs font-normal text-slate-400">
                            ({log.metadata.email})
                          </span>
                        )}
                      </p>
                    )}

                    {/* Actor — who performed the action */}
                    {log.actorName && (
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
                        Invited by&nbsp;
                        <span className="font-medium text-slate-700">{log.actorName}</span>
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </p>
                    {/* Immutable lock badge */}
                    <span className="inline-flex items-center gap-0.5 mt-1 text-[9px] font-semibold text-slate-300">
                      <Lock className="w-2.5 h-2.5" />
                      Immutable
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
