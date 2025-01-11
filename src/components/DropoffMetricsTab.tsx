import React from 'react';
import { DashboardCard } from './DashboardCard';
import { Users, TrendingDown, Clock } from 'lucide-react';
import { EventMetrics } from './EventMetrics';
import type { AnalyticsData } from '../types/analytics';

interface DropoffMetricsTabProps {
  data: AnalyticsData;
  type: 'anonymousToSignedUp' | 'signedUpToPurchased';
}

export const DropoffMetricsTab: React.FC<DropoffMetricsTabProps> = ({ data, type }) => {
  const stage = type === 'anonymousToSignedUp' ? 'anonymous' : 'signedUp';
  const stageMetrics = data.stageMetrics[stage];
  const funnelMetrics = data.funnelMetrics[type];
  
  const dropoffUsers = stageMetrics.currentUsers - funnelMetrics.conversionCount;
  const dropoffRate = (dropoffUsers / stageMetrics.currentUsers * 100).toFixed(1);
  const avgTimeInStage = ((stageMetrics.lastExitDate - stageMetrics.lastEntryDate) / (1000 * 60 * 60)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Dropoff Overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-gray-600">Dropoff Rate</span>
              </div>
              <span className="text-xl font-bold text-red-600">{dropoffRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-gray-600">Avg Time in Stage</span>
              </div>
              <span className="text-xl font-bold text-red-600">{avgTimeInStage}h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-gray-600">Dropoff Users</span>
              </div>
              <span className="text-xl font-bold text-red-600">
                {dropoffUsers.toLocaleString()}
              </span>
            </div>
          </div>
        </DashboardCard>
      </div>

      <EventMetrics data={data} stage={stage} />
    </div>
  );
};