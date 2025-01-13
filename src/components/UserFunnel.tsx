import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardCard } from './DashboardCard';
import type { AnalyticsData } from '../types/analytics';

interface UserFunnelProps {
  data: AnalyticsData;
}

export const UserFunnel: React.FC<UserFunnelProps> = ({ data }) => {
  const funnelData = [
    {
      stage: 'Anonymous',
      users: data.stageMetrics?.anonymous?.totalUsers || 0,
    },
    {
      stage: 'Signed Up',
      users: data.stageMetrics?.signedUp?.totalUsers || 0,
    },
    {
      stage: 'Purchased',
      users: data.stageMetrics?.purchased?.totalUsers || 0,
    },
  ];

  return (
    <DashboardCard title="User Funnel">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};