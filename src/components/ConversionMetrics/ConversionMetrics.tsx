import React from 'react';
import { ConversionMetricsCard } from './ConversionMetricsCard';
import { DashboardCard } from '../DashboardCard';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import type { ConversionStageMetrics } from '../../types/conversion';

interface ConversionMetricsProps {
  type: 'anonymousToSignedUp' | 'signedUpToPurchased';
  stageMetrics: ConversionStageMetrics;
}

export const ConversionMetrics: React.FC<ConversionMetricsProps> = ({
  type,
  stageMetrics
}) => {
  const title = type === 'anonymousToSignedUp' ? 'Anonymous → Signed Up' : 'Signed Up → Purchased';

  return (
    <div className="space-y-6">
      <ConversionMetricsCard 
        title={title}
        stageMetrics={stageMetrics}
      />

      <DashboardCard title="Messages by Character">
        <div className="space-y-3">
          {Object.entries(stageMetrics.messagesByCharacter)
            .sort(([, a], [, b]) => b - a)
            .map(([character, count]) => (
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
                    ({((count / stageMetrics.totalMessages) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
        </div>
      </DashboardCard>

      {Object.keys(stageMetrics.simpleEvents).length > 0 && (
        <DashboardCard title="Simple Events">
          <div className="space-y-3">
            {Object.entries(stageMetrics.simpleEvents)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([event, metrics]) => (
                <div key={event} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {event.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-gray-500">Count:</span>
                      <span className="ml-1 font-medium">{metrics.count.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Unique Users:</span>
                      <span className="ml-1 font-medium">{metrics.uniqueUsers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DashboardCard>
      )}

      {Object.keys(stageMetrics.valueEvents).length > 0 && (
        <DashboardCard title="Value Events">
          <div className="space-y-6">
            {Object.entries(stageMetrics.valueEvents).map(([eventType, values]) => (
              <div key={eventType} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {eventType.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(values).map(([value, event]) => (
                    <div key={value} className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {value.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm text-gray-500">Count:</span>
                          <span className="ml-1 font-medium">{event.count}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Unique Users:</span>
                          <span className="ml-1 font-medium">{event.uniqueUserCount}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">All Values:</span>
                          <span className="ml-1 font-medium">{event.uniqueUserCountAllValues}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {Object.keys(stageMetrics.characterEvents).length > 0 && (
        <DashboardCard title="Character Events">
          <div className="space-y-6">
            {Object.entries(stageMetrics.characterEvents).map(([eventType, characters]) => (
              <div key={eventType} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {eventType.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(characters).map(([character, event]) => (
                    <div key={character} className="flex justify-between items-center">
                      <span className="text-gray-700">{character}</span>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm text-gray-500">Count:</span>
                          <span className="ml-1 font-medium">{event.count}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Users:</span>
                          <span className="ml-1 font-medium">{event.uniqueUserCount}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">All Characters:</span>
                          <span className="ml-1 font-medium">{event.uniqueUserCountAllCharacters}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {Object.keys(stageMetrics.errors).length > 0 && (
        <DashboardCard title="Error Analysis">
          <div className="space-y-6">
            {Object.entries(stageMetrics.errors).map(([errorType, error]) => (
              <div key={errorType}>
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {errorType.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h3>
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