import React, { useState, useEffect } from 'react';
import { Users, Building2, Tags, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const mockChartData = [
  { name: 'Jan', users: 400, businesses: 240, offers: 100 },
  { name: 'Feb', users: 300, businesses: 139, offers: 210 },
  { name: 'Mar', users: 200, businesses: 980, offers: 229 },
  { name: 'Apr', users: 278, businesses: 390, offers: 200 },
  { name: 'May', users: 189, businesses: 480, offers: 218 },
  { name: 'Jun', users: 239, businesses: 380, offers: 250 },
  { name: 'Jul', users: 349, businesses: 430, offers: 310 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className="text-emerald-500 font-medium">{trend}</span>
        <span className="text-slate-500 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    businesses: 0,
    offers: 0,
    pendingBusinesses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a single /api/v1/stats endpoint
    // For now we will mock the overview stats to simulate the layout
    setTimeout(() => {
      setStats({
        users: 1248,
        businesses: 142,
        offers: 890,
        pendingBusinesses: 12
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.users} 
          icon={Users} 
          color="bg-blue-100 text-blue-600"
          trend="+12%"
        />
        <StatCard 
          title="Verified Businesses" 
          value={stats.businesses} 
          icon={Building2} 
          color="bg-indigo-100 text-indigo-600"
          trend="+5%"
        />
        <StatCard 
          title="Active Offers" 
          value={stats.offers} 
          icon={Tags} 
          color="bg-emerald-100 text-emerald-600"
          trend="+18%"
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingBusinesses} 
          icon={AlertTriangle} 
          color="bg-amber-100 text-amber-600"
          trend="-2%"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Growth Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBusinesses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
              <Area type="monotone" dataKey="businesses" stroke="#6366f1" fillOpacity={1} fill="url(#colorBusinesses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
