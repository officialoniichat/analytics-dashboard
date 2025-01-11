import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DashboardCard } from './DashboardCard';
import type { AnalyticsData } from '../types/analytics';

interface MessageMetricsProps {
  data: AnalyticsData;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export const MessageMetrics: React.FC<MessageMetricsProps> = ({ data }) => {
  // Get message data from purchased stage byCharacter
  const messageData = data.messageMetrics?.purchased?.byCharacter
    ? Object.entries(data.messageMetrics.purchased.byCharacter)
        .map(([name, count]) => ({
          name,
          value: count
        }))
        .filter(item => item.value > 0)
    : [];

  if (messageData.length === 0) {
    return (
      <DashboardCard title="Message Distribution by Character">
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No message data available
        </div>
      </DashboardCard>
    );
  }

  const total = messageData.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardCard title="Message Distribution by Character">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={messageData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name} (${((value / total) * 100).toFixed(1)}%)`}
            >
              {messageData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                `${value.toLocaleString()} messages (${((value / total) * 100).toFixed(1)}%)`,
                'Messages'
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};