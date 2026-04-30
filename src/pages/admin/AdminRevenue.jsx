import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { CreditCard, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

// eslint-disable-next-line no-unused-vars
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

const AdminRevenue = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    recentTransactions: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/metrics/revenue');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching revenue metrics', error);
        toast.error('Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Revenue Performance</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor platform earnings and payment transactions.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(metrics.totalRevenue)}
            icon={DollarSign}
            colorClass="bg-green-50 text-green-600"
            subtitle="Lifetime platform revenue"
          />
          <StatCard 
            title="Total Transactions" 
            value={metrics.totalTransactions}
            icon={CreditCard}
            colorClass="bg-blue-50 text-blue-600"
            subtitle="Successful payments"
          />
          <StatCard 
            title="Avg Revenue Per User" 
            value={formatCurrency(metrics.advanced?.arpu || 0)}
            icon={Activity}
            colorClass="bg-purple-50 text-purple-600"
            subtitle="ARPU across active users"
          />
          <StatCard 
            title="Active Subscriptions" 
            value={metrics.advanced?.active_subscriptions || 0}
            icon={TrendingUp}
            colorClass="bg-amber-50 text-amber-600"
            subtitle="Currently paying employers"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue Breakdown</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">ASE Searches</span>
                  <span className="font-bold text-gray-900">{formatCurrency(metrics.advanced?.ase_revenue || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Subscriptions</span>
                  <span className="font-bold text-gray-900">{formatCurrency(metrics.advanced?.subscription_revenue || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">One-Time Payments</span>
                  <span className="font-bold text-gray-900">{formatCurrency(metrics.advanced?.one_time_revenue || 0)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Revenue (Last 6 Months)</h2>
            <div className="h-[300px]">
              {metrics.monthlyRevenue && metrics.monthlyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `₦${(value/1000)}k`} 
                    />
                    <RechartsTooltip 
                      formatter={(value) => formatCurrency(value)}
                      cursor={{fill: 'transparent'}} 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="revenue" fill="#16730F" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No revenue data available for the last 6 months.
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {metrics.recentTransactions && metrics.recentTransactions.length > 0 ? (
                metrics.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">{tx.plan_type || 'Custom Plan'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-gray-800">
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No recent transactions.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminRevenue;
