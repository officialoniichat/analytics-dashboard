import React from 'react';
import { DashboardCard } from './DashboardCard';
import { 
  ShoppingCart, CreditCard, Package, TrendingUp,
  DollarSign, BarChart2
} from 'lucide-react';
import type { PurchaseMetrics as PurchaseMetricsType } from '../types/analytics';

interface PurchaseMetricsProps {
  metrics: PurchaseMetricsType;
  className?: string;
}

export const PurchaseMetrics: React.FC<PurchaseMetricsProps> = ({ metrics, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Purchase Overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Total Purchases</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {metrics.totalPurchases.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Total Revenue</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Avg. Purchase</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                ${(metrics.totalRevenue / metrics.totalPurchases).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Purchases by Item">
          <div className="space-y-3">
            {Object.entries(metrics.purchasesByItem)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([itemId, data]) => (
                <div key={itemId} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">
                      {itemId.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Count</span>
                      <div className="font-medium text-gray-900">
                        {data.count.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Revenue</span>
                      <div className="font-medium text-gray-900">
                        ${data.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Revenue Metrics">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">Items/Purchase</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {(Object.values(metrics.purchasesByItem).reduce((acc, curr) => acc + curr.count, 0) / metrics.totalPurchases).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">Avg. Item Price</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                ${(metrics.totalRevenue / Object.values(metrics.purchasesByItem).reduce((acc, curr) => acc + curr.count, 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};