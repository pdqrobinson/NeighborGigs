'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { Users, 
[truncated]
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.userCount}
          description={stats.userChange >= 0 ? `+${stats.userChange}% this week` : `${stats.userChange}% this week`}
          icon={Users}
        />
        <StatCard
          title="Total Tasks"
          value={stats.taskCount}
          description={stats.taskChange >= 0 ? `+${stats.taskChange}% this week` : `${stats.taskChange}% this week`}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Active Broadcasts"
          value={stats.activeBroadcasts}
          description="Helpers currently available"
          icon={Radio}
        />
        <StatCard
          title="Avg. Rating"
          value={stats.avgRating}
          description="Community trust score"
          icon={Star}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Tasks Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={taskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none' }} />
                <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Task Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent users</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.full_name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.phone_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{user.rating ?? '—'} ⭐</p>
                    <p className="text-sm text-gray-500">Lvl {user.level ?? '—'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent tasks</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    {task.category === 'Grocery' ? '🛒' : task.category === 'Delivery' ? '📦' : '🔧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      ${task.price_cents / 100} · {task.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {task.status === 'PAID' ? '✅' : task.status === 'COMPLETED' ? '⏳' : '📋'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}