import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { Briefcase, CheckCircle, Activity, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
  </div>
);

const AdminRecruitment = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/metrics/recruitment');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching recruitment metrics', error);
        toast.error('Failed to load recruitment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F]"></div>
        </div>
      </AdminLayout>
    );
  }

  // Format date for charts
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const funnelData = metrics?.funnel ? [
    { name: 'Total Jobs', count: parseInt(metrics.funnel.total_jobs) || 0, fill: '#3b82f6' },
    { name: 'Applications', count: parseInt(metrics.funnel.total_applications) || 0, fill: '#f59e0b' },
    { name: 'Hires', count: parseInt(metrics.funnel.total_hires) || 0, fill: '#16730F' },
  ] : [];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Recruitment Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Track job postings, applications, and successful hires across the platform.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Jobs Posted" 
            value={metrics?.funnel?.total_jobs || 0}
            icon={Briefcase}
            colorClass="bg-blue-50 text-blue-600"
            subtitle="All time job listings"
          />
          <StatCard 
            title="Total Applications" 
            value={metrics?.funnel?.total_applications || 0}
            icon={Users}
            colorClass="bg-purple-50 text-purple-600"
            subtitle="Across all jobs"
          />
          <StatCard 
            title="Successful Hires" 
            value={metrics?.latest?.successful_hires || metrics?.funnel?.total_hires || 0}
            icon={CheckCircle}
            colorClass="bg-green-50 text-green-600"
            subtitle="Marked as hired"
          />
          <StatCard 
            title="Employer Activity Rate" 
            value={`${metrics?.latest?.employer_activity_rate || 0}%`}
            icon={Activity}
            colorClass="bg-orange-50 text-orange-600"
            subtitle="Employers active in last 30 days"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recruitment Funnel Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recruitment Funnel</h3>
            <div className="h-64 w-full">
              {funnelData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#4b5563', fontSize: 12}}
                    />
                    <RechartsTooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No funnel data available</div>
              )}
            </div>
          </div>

          {/* Hiring Trend Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Hiring Trend (Last 30 Days)</h3>
            <div className="h-64 w-full">
              {metrics?.trend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: '#9ca3af', fontSize: 12}}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="successful_hires" name="Successful Hires" stroke="#16730F" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0}} />
                    <Line type="monotone" dataKey="total_job_posts" name="New Job Posts" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No hiring trend data available</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminRecruitment;
