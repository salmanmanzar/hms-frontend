'use client';

import { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '@/lib/api';
import {
  Building2,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  organizationId?: string;
  doctors?: { id: string }[];
}

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/department');
      setDepartments(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load hospital departments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    setCreateLoading(true);
    setError('');
    setSuccess('');

    try {
      const newDept = await apiRequest('/department', {
        method: 'POST',
        body: JSON.stringify({ name: newDeptName.trim() }),
      });

      setDepartments((prev) => [...prev, newDept]);
      setNewDeptName('');
      setIsAdding(false);
      setSuccess(`Department "${newDept.name}" created successfully!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to create department');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete department "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      await apiRequest(`/department/${id}`, {
        method: 'DELETE',
      });

      setDepartments((prev) => prev.filter((d) => d.id !== id));
      setSuccess(`Department "${name}" deleted successfully!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete department');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments;
    return departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-700 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 mb-3 border border-white/15">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Structure Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Department Registry 🏥
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl leading-relaxed">
            Manage your hospital departments. Doctors joining your hospital will select from these configured departments when setting up their practitioner profiles.
          </p>
        </div>

        {/* Action Button */}
        <div className="relative z-10 self-start sm:self-center">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-3 rounded-2xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAdding ? 'Close Form' : 'Add Department'}</span>
          </button>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-24 -top-12 w-36 h-36 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center gap-3 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add Department Form Card */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 border border-slate-100 animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Hospital Department</h2>
              <p className="text-xs text-slate-400">Specify the department title to make it available for practitioner profiles.</p>
            </div>
          </div>

          <form onSubmit={handleCreateDepartment} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="e.g. Cardiology, Pediatrics, General Medicine, Dermatology"
              required
              className="flex-1 px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={createLoading}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition duration-150 cursor-pointer text-sm shrink-0"
            >
              {createLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Department</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Main Section Header & Search */}
      <div className="bg-white rounded-3xl p-6 shadow-xs ring-1 ring-slate-200/80 border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Configured Departments</span>
              <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                {departments.length} Total
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These departments are queryable by doctors during profile registration.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full pl-10 pr-4 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-100 animate-pulse space-y-3"
              >
                <div className="h-5 w-36 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredDepartments.length === 0 ? (
          /* Empty State */
          <div className="py-12 px-4 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-3">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {search ? 'No matching departments found' : 'No departments added yet'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {search
                ? `No department matches "${search}". Try clearing search or add a new department.`
                : 'Get started by creating your hospital departments so doctors can choose their specialty upon profile setup.'}
            </p>
            {!search && (
              <button
                onClick={() => setIsAdding(true)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 px-4 rounded-xl transition duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Department</span>
              </button>
            )}
          </div>
        ) : (
          /* Departments Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl p-5 ring-1 ring-slate-200/70 border border-slate-100 hover:shadow-md hover:border-blue-200 transition duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-50 to-teal-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {dept.name}
                    </h3>
                    <span className="inline-block text-[11px] text-slate-400 font-medium mt-0.5">
                      Active Department
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                  disabled={deletingId === dept.id}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-150 shrink-0 cursor-pointer"
                  title="Delete Department"
                >
                  {deletingId === dept.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
