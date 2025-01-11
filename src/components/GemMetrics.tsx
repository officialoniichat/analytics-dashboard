import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DashboardCard } from './DashboardCard';
import type { AnalyticsData } from '../types/analytics';

interface GemMetricsProps {
  data: AnalyticsData;
}

export const GemMetrics: React.FC<GemMetricsProps> = ({ data }) => {
  // Process gem data for each stage
  const gemData = ['anonymous', 'signedUp', 'purchased'].map(stage => {
    const stageGems = data.gemMetrics?.[stage];
    const byItem = stageGems?.byItem || {};
    
    return {
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      ...Object.entries(byItem).reduce((acc, [key, value]) => ({
        ...acc,
        [key.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')]: value
      }), {})
    };
  }).filter(stage => Object.keys(stage).length > 1); // Filter out stages with no gem data

  if (gemData.length === 0) {
    return (
      <DashboardCard title="Gem Usage by Stage">
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No gem usage data available
        </div>
      </DashboardCard>
    );
  }

  // Get all unique gem types across all stages
  const gemTypes = Array.from(new Set(
    gemData.flatMap(stage => 
      Object.keys(stage).filter(key => key !== 'stage')
    )
  ));

  // Colors for different gem types
  const colors = {
    'Message Regeneration': '#10B981',
    'Character Unlock': '#3B82F6',
    'Message Unlock': '#F59E0B',
  };

  return (
    <DashboardCard title="Gem Usage by Stage">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gemData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Legend />
            {gemTypes.map((gemType) => (
              <Bar 
                key={gemType}
                dataKey={gemType}
                fill={colors[gemType] || '#CBD5E1'}
                stackId="a"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};