import React from 'react';
import { DashboardCard } from './DashboardCard';
import { 
  MessageCircle, Gem, Users, Clock, AlertTriangle,
  TrendingUp, Activity, ArrowRight
} from 'lucide-react';
import { EventMetrics } from './EventMetrics';
import type { AnalyticsData } from '../types/analytics';

interface ConversionMetricsTabProps {
  data: AnalyticsData;
  type: 'anonymousToSignedUp' | 'signedUpToPurchased';
}

export const ConversionMetricsTab: React.FC<ConversionMetricsTabProps> = ({ data, type }) => {
  const metrics = data.convertedMetrics?.[type];
  const stage = type === 'anonymousToSignedUp' ? metrics?.preSignup : metrics?.prePurchase;
  const funnelMetrics = data.funnelMetrics?.[type] || {};
  const eventStage = type === 'anonymousToSignedUp' ? 'anonymous' : 'signedUp';
  const stageMetrics = data.stageMetrics?.[eventStage];

  if (!stage || !stageMetrics) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No conversion data available
      </div>
    );
  }

  const avgMessagesPerUser = stage.totalMessages / stage.userCount;
  const conversionRate = (funnelMetrics.conversionCount / stageMetrics.totalUsers * 100).toFixed(1);
  const avgTimeToConvert = ((funnelMetrics.totalConversionTime || 0) / (funnelMetrics.conversionsTracked || 1) / (1000 * 60 * 60)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Conversion Overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Conversion Rate</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{conversionRate}%</span>
            </div>
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
                {stage.userCount.toLocaleString()}
              </span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Engagement Metrics">
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
                <Activity className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">Total Messages</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {stage.totalMessages.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Gem className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">Gems/User</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {(stage.gemMetrics.total / stage.userCount).toFixed(1)}
              </span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Gem Usage">
          <div className="space-y-4">
            {Object.entries(stage.gemMetrics.byItem).map(([item, count]) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Gem className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-gray-600">
                    {item.split('.').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Messages by Character">
        <div className="space-y-3">
          {Object.entries(stage.messagesByCharacter).map(([character, count]) => (
            <div key={character} className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-indigo-500 mr-2" />
                <span className="text-gray-600">{character}</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-indigo-600">
                  {count.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({((count / stage.totalMessages) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <EventMetrics data={data} stage={eventStage} />

      {Object.keys(stage.errors || {}).length > 0 && (
        <DashboardCard title="Error Analysis">
          <div className="space-y-6">
            {Object.entries(stage.errors).map(([errorType, error]) => (
              <div key={errorType}>
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {errorType.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h3>
                  <span className="text-sm text-gray-500 ml-2">
                    ({error.count} total)
                  </span>
                </div>
                <div className="space-y-2 pl-7">
                  {Object.entries(error.details)
                    .sort(([, a], [, b]) => b - a)
                    .map(([detail, count]) => (
                      <div key={detail} className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {detail.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {count.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({((count / error.count) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
};