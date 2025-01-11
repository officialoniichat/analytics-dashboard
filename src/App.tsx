import React, { useState, useEffect } from 'react';
import { analyticsData } from './data/mockData';
import { StatsOverview } from './components/StatsOverview';
import { UserFunnel } from './components/UserFunnel';
import { MessageMetrics } from './components/MessageMetrics';
import { GemMetrics } from './components/GemMetrics';
import { EventMetrics } from './components/EventMetrics';
import { ConversionMetricsTab } from './components/ConversionMetricsTab';
import { 
  getAnalyticsSummary, 
  formatTimestamp, 
  withErrorHandling,
  AnalyticsData 
} from './utils/firebase';

type TabType = 'dashboard' | 'anonymousToSignedUp' | 'signedUpToPurchased';

const TABS = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'anonymousToSignedUp', name: 'Anonymous → Signed Up' },
  { id: 'signedUpToPurchased', name: 'Signed Up → Purchased' },
] as const;

function App() {
  const [selectedTab, setSelectedTab] = useState<TabType>('dashboard');
  const [data, setData] = useState<AnalyticsData>(analyticsData);
  const [useMockData, setUseMockData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      if (!useMockData) {
        const result = await withErrorHandling(
          async () => {
            const firestoreData = await getAnalyticsSummary();
            if (!firestoreData) {
              throw new Error('No data available');
            }
            return firestoreData;
          },
          null,
          'Failed to fetch analytics data'
        );

        if (result) {
          setData(result);
        } else {
          setData(analyticsData);
          setError('Failed to load live data, falling back to mock data');
        }
      } else {
        setData(analyticsData);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [useMockData]);

  const renderDashboardContent = () => (
    <>
      <StatsOverview data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserFunnel data={data} />
        <MessageMetrics data={data} />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <GemMetrics data={data} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <EventMetrics data={data} stage="anonymous" />
        <EventMetrics data={data} stage="signedUp" />
        <EventMetrics data={data} stage="purchased" />
      </div>
    </>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'anonymousToSignedUp':
        return <ConversionMetricsTab data={data} type="anonymousToSignedUp" />;
      case 'signedUpToPurchased':
        return <ConversionMetricsTab data={data} type="signedUpToPurchased" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">
                  Last updated: {formatTimestamp(data.lastUpdated)}
                </p>
                {error && (
                  <span className="text-red-500 text-sm">
                    {error}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setUseMockData(!useMockData)}
                className={`px-4 py-2 rounded transition-colors ${
                  useMockData
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {useMockData ? 'Use Live Data' : 'Use Mock Data'}
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as TabType)}
                  className={`
                    border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap
                    ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                  disabled={isLoading}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}

export default App;