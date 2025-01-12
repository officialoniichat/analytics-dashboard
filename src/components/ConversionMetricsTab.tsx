import React from 'react';
import { DashboardCard } from './DashboardCard';
import { 
  MessageCircle, Gem, Users, Clock, AlertTriangle,
  TrendingUp, Activity, ArrowRight, Monitor, Globe,
  Smartphone, Laptop
} from 'lucide-react';
import { EventMetrics } from './EventMetrics';
import { PurchaseMetrics } from './PurchaseMetrics';
import type { AnalyticsData } from '../types/analytics';
import type { ConversionStageMetrics } from '../types/conversion';

const formatBrowserName = (browser: string): string => {
  const browserNames: Record<string, string> = {
    'Chrome': 'Google Chrome',
    'Safari': 'Apple Safari',
    'Firefox': 'Mozilla Firefox',
    'Edge': 'Microsoft Edge',
    'Opera': 'Opera Browser',
    'Samsung': 'Samsung Internet',
    'IE': 'Internet Explorer',
    'unknown': 'Unknown Browser'
  };
  return browserNames[browser] || browser;
};

const formatPlatformName = (platform: string): string => {
  const platformNames: Record<string, string> = {
    'web': 'Web Browser',
    'ios': 'iOS App',
    'android': 'Android App'
  };
  return platformNames[platform] || platform;
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'ios':
    case 'android':
      return <Smartphone className="w-5 h-5 text-green-500 mr-2" />;
    case 'web':
      return <Laptop className="w-5 h-5 text-green-500 mr-2" />;
    default:
      return <Globe className="w-5 h-5 text-green-500 mr-2" />;
  }
};

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
  const timeToConvert = type === 'anonymousToSignedUp' ? metrics?.preSignup?.timeToConvert : metrics?.prePurchase?.timeToConvert;
  console.log(timeToConvert,  stage.userCount)
  const avgTimeToConvertInMs = (timeToConvert || 0) / (stage.userCount || 1); // Avoid division by zero
  const avgHours = Math.floor(avgTimeToConvertInMs / (1000 * 60 * 60));
  const avgMinutes = Math.floor((avgTimeToConvertInMs % (1000 * 60 * 60)) / (1000 * 60));
  const avgSeconds = Math.floor((avgTimeToConvertInMs % (1000 * 60)) / 1000);
  
  const formattedTime =
  avgHours === 0 && avgMinutes === 0 && avgSeconds === 0
    ? "<1s"
    : `${avgHours}h ${avgMinutes}m ${avgSeconds}s`;
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
  <span className="text-xl font-bold text-blue-600">
    {formattedTime}
  </span>
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

      {(stage.browser || stage.platform) && (
        <DashboardCard title="Platform Analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stage.browser && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Monitor className="w-5 h-5 text-blue-500 mr-2" />
                  Browser Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(stage.browser)
                    .sort(([, a], [, b]) => b - a)
                    .map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700 font-medium">{formatBrowserName(browser)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {count.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2 w-16 text-right">
                            ({((count / stage.userCount) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )}
            {stage.platform && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Globe className="w-5 h-5 text-green-500 mr-2" />
                  Platform Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(stage.platform)
                    .sort(([, a], [, b]) => b - a)
                    .map(([platform, count]) => (
                      <div key={platform} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center">
                          {getPlatformIcon(platform)}
                          <span className="text-gray-700 font-medium">{formatPlatformName(platform)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {count.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2 w-16 text-right">
                            ({((count / stage.userCount) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DashboardCard>
      )}

      <EventMetrics data={data} stage={eventStage} />

      {type === 'signedUpToPurchased' && data.purchaseMetrics && (
        <PurchaseMetrics metrics={data.purchaseMetrics} />
      )}

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