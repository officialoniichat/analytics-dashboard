import React from 'react';
import { DashboardCard } from './DashboardCard';
import { 
  Monitor, Globe, Smartphone, Laptop,
  Users, ArrowRight
} from 'lucide-react';
import type { AnalyticsData } from '../types/analytics';

interface StagePlatformBrowserProps {
  data: AnalyticsData;
  className?: string;
}

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

const StageMetricsCard: React.FC<{
  title: string;
  browsers: Record<string, number>;
  platforms: Record<string, number>;
}> = ({ title, browsers, platforms }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
      <Users className="w-5 h-5 text-blue-500 mr-2" />
      {title}
    </h3>
    
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 flex items-center">
        <Monitor className="w-4 h-4 text-blue-500 mr-2" />
        Browsers
      </h4>
      {Object.entries(browsers)
        .sort(([, a], [, b]) => b - a)
        .map(([browser, count]) => (
          <div key={browser} className="flex items-center justify-between pl-6">
            <span className="text-gray-600 text-sm">{formatBrowserName(browser)}</span>
            <span className="font-medium text-gray-900">{count}</span>
          </div>
      ))}
    </div>

    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 flex items-center">
        <Globe className="w-4 h-4 text-green-500 mr-2" />
        Platforms
      </h4>
      {Object.entries(platforms)
        .sort(([, a], [, b]) => b - a)
        .map(([platform, count]) => (
          <div key={platform} className="flex items-center justify-between pl-6">
            <div className="flex items-center">
              {getPlatformIcon(platform)}
              <span className="text-gray-600 text-sm">{formatPlatformName(platform)}</span>
            </div>
            <span className="font-medium text-gray-900">{count}</span>
          </div>
      ))}
    </div>
  </div>
);

export const StagePlatformBrowser: React.FC<StagePlatformBrowserProps> = ({ data, className = '' }) => {
  const stages = {
    anonymous: {
      title: 'Anonymous Users',
      browsers: data.stageMetrics?.anonymous?.browsers || {},
      platforms: data.stageMetrics?.anonymous?.platforms || {},
    },
    signedUp: {
      title: 'Signed Up Users',
      browsers: data.stageMetrics?.signedUp?.browsers || {},
      platforms: data.stageMetrics?.signedUp?.platforms || {},
    },
    purchased: {
      title: 'Purchased Users',
      browsers: data.stageMetrics?.purchased?.browsers || {},
      platforms: data.stageMetrics?.purchased?.platforms || {},
    },
  };

  return (
    <DashboardCard title="Platform & Browser Distribution" className={className}>
      <div className="space-y-6">
        {Object.entries(stages).map(([key, stage], index, array) => (
          <React.Fragment key={key}>
            <StageMetricsCard {...stage} />
            {index < array.length - 1 && (
              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </DashboardCard>
  );
};