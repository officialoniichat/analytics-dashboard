import React from 'react';
import { Users, MessageSquare, Gem, ShoppingCart, DollarSign } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import type { AnalyticsData } from '../types/analytics';

interface StatsOverviewProps {
  data: AnalyticsData;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ data }) => {
  // Calculate total users from stage metrics
  const totalUsers = (
    (data.stageMetrics?.anonymous?.totalUsers || 0) +
    (data.stageMetrics?.signedUp?.totalUsers || 0) +
    (data.stageMetrics?.purchased?.totalUsers || 0)
  );

  // Calculate total messages from messageMetrics totals
  const totalMessages = (
    (data.messageMetrics?.anonymous?.total || 0) +
    (data.messageMetrics?.signedUp?.total || 0) +
    (data.messageMetrics?.purchased?.total || 0)
  );

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Messages',
      value: totalMessages.toLocaleString(),
      icon: MessageSquare,
      color: 'text-green-600',
    },
    {
      title: 'Active Users',
      value: (
        (data.stageMetrics?.anonymous?.currentUsers || 0) +
        (data.stageMetrics?.signedUp?.currentUsers || 0) +
        (data.stageMetrics?.purchased?.currentUsers || 0)
      ).toLocaleString(),
      icon: Gem,
      color: 'text-purple-600',
    },
    {
      title: 'Total Purchases',
      value: (data.purchaseMetrics?.totalPurchases || 0).toLocaleString(),
      icon: ShoppingCart,
      color: 'text-orange-600',
    },
    {
      title: 'Total Revenue',
      value: `$${(data.purchaseMetrics?.totalRevenue || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
      {stats.map((stat) => (
        <DashboardCard key={stat.title} title={stat.title}>
          <div className="flex items-center">
            <stat.icon className={`w-8 h-8 ${stat.color} mr-3`} />
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
};