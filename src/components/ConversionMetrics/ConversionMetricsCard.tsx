import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { TrendingUp, Clock, Users, MessageCircle, Gem } from 'lucide-react';
import type { ConversionStageMetrics } from '../../types/conversion';

interface ConversionMetricsCardProps {
  title: string;
  stageMetrics: ConversionStageMetrics;
}

export const ConversionMetricsCard: React.FC<ConversionMetricsCardProps> = ({ 
  title, 
  stageMetrics 
}) => {
  const avgMessagesPerUser = stageMetrics.totalMessages / stageMetrics.userCount;
  const avgTimeToConvert = (stageMetrics.timeToConvert / stageMetrics.userCount / (1000 * 60 * 60)).toFixed(1);
  const avgGemsPerUser = stageMetrics.gemMetrics.total / stageMetrics.userCount;

  return (
    <DashboardCard title={title}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-600">Avg Time to Convert</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{avgTimeToConvert}h</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-600">Total Users</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {stageMetrics.userCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-600">Messages/User</span>
            </div>
            <span className="text-xl font-bold text-green-600">
              {avgMessagesPerUser.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-600">Total Messages</span>
            </div>
            <span className="text-xl font-bold text-green-600">
              {stageMetrics.totalMessages.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gem className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-gray-600">Gems/User</span>
            </div>
            <span className="text-xl font-bold text-purple-600">
              {avgGemsPerUser.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gem className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-gray-600">Total Gems</span>
            </div>
            <span className="text-xl font-bold text-purple-600">
              {stageMetrics.gemMetrics.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};