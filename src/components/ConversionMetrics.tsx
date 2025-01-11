import React from 'react';
import { DashboardCard } from './DashboardCard';
import { TrendingUp, MessageSquare, AlertTriangle } from 'lucide-react';
import type { AnalyticsData } from '../types/analytics';

interface ConversionMetricsProps {
  data: AnalyticsData;
  type: 'anonymousToSignedUp' | 'signedUpToPurchased';
}

export const ConversionMetrics: React.FC<ConversionMetricsProps> = ({ data, type }) => {
  const metrics = data.convertedMetrics[type];
  const stage = type === 'anonymousToSignedUp' ? metrics.preSignup : metrics.prePurchase;
  const funnelMetrics = data.funnelMetrics[type];

  if (!stage) return null;

  const avgMessagesPerUser = stage.totalMessages / stage.userCount;
  const conversionRate = (funnelMetrics.conversionCount / stage.userCount * 100).toFixed(1);
  const avgTimeToConvert = (funnelMetrics.averageConversionTime / (1000 * 60 * 60)).toFixed(1); // hours

  return (
    <DashboardCard title={`${type === 'anonymousToSignedUp' ? 'Anonymous → Signed Up' : 'Signed Up → Purchased'} Metrics`}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">Conversion Stats</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-blue-700">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-900">{conversionRate}%</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Avg Time to Convert</p>
                <p className="text-2xl font-bold text-blue-900">{avgTimeToConvert} hours</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">Engagement</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-green-700">Messages per User</p>
                <p className="text-2xl font-bold text-green-900">{avgMessagesPerUser.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Total Users</p>
                <p className="text-2xl font-bold text-green-900">{stage.userCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Last Events Before Conversion</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              {Object.entries(stage.simpleEvents)
                .sort(([, a], [, b]) => b - a)
                .map(([event, count]) => (
                  <div key={event} className="flex justify-between items-center">
                    <span className="text-gray-700">{event}</span>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium">{count.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({((count / stage.userCount) * 100).toFixed(1)}% of users)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="text-lg font-semibold">Error Analysis</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            {Object.entries(stage.errors).map(([errorType, error]) => (
              <div key={errorType} className="mb-4 last:mb-0">
                <h4 className="font-medium mb-2 text-red-600">{errorType}</h4>
                <div className="space-y-2">
                  {Object.entries(error.details)
                    .sort(([, a], [, b]) => b - a)
                    .map(([detail, count]) => (
                      <div key={detail} className="flex justify-between items-center">
                        <span className="text-gray-700">{detail}</span>
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium">{count.toLocaleString()}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            ({((count / error.count) * 100).toFixed(1)}% of errors)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};