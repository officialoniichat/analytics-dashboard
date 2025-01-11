import React from 'react';
import { 
  GripVertical, Users, Activity, Sparkles, MessageCircle, 
  ChevronDown, ChevronRight, Hash, EyeOff, Eye
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { EventItem } from './types';

interface SortableEventProps {
  event: EventItem;
  isExpanded: boolean;
  onToggle: () => void;
  onHide: () => void;
  maxAvgPerUser: number;
  isHidden: boolean;
}

export const SortableEvent: React.FC<SortableEventProps> = ({ 
  event, 
  isExpanded, 
  onToggle, 
  onHide,
  maxAvgPerUser,
  isHidden
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'character':
        return {
          bg: isHidden ? 'bg-gray-50' : 'bg-purple-50 hover:bg-purple-100',
          bar: isHidden ? 'bg-gray-200' : 'bg-purple-200',
          text: isHidden ? 'text-gray-700' : 'text-purple-700',
          border: isHidden ? 'border-gray-100' : 'border-purple-100'
        };
      case 'value':
        return {
          bg: isHidden ? 'bg-gray-50' : 'bg-blue-50 hover:bg-blue-100',
          bar: isHidden ? 'bg-gray-200' : 'bg-blue-200',
          text: isHidden ? 'text-gray-700' : 'text-blue-700',
          border: isHidden ? 'border-gray-100' : 'border-blue-100'
        };
      case 'simple':
        return {
          bg: isHidden ? 'bg-gray-50' : 'bg-green-50 hover:bg-green-100',
          bar: isHidden ? 'bg-gray-200' : 'bg-green-200',
          text: isHidden ? 'text-gray-700' : 'text-green-700',
          border: isHidden ? 'border-gray-100' : 'border-green-100'
        };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'character':
        return <MessageCircle className={`w-4 h-4 mr-2 ${isHidden ? 'text-gray-400' : 'text-purple-500'}`} />;
      case 'value':
        return <Sparkles className={`w-4 h-4 mr-2 ${isHidden ? 'text-gray-400' : 'text-blue-500'}`} />;
      case 'simple':
        return <Hash className={`w-4 h-4 mr-2 ${isHidden ? 'text-gray-400' : 'text-green-500'}`} />;
    }
  };

  const calculateMetrics = () => {
    if (event.items) {
      const totalCount = event.items.reduce((sum, item) => sum + item.count, 0);
      
      // Use the appropriate total unique user count based on event type
      let totalUniqueUsers;
      let avgPerUser;
      
      if (event.type === 'character') {
        totalUniqueUsers = event.uniqueUserCountAllCharacters || 0;
        avgPerUser = totalCount / (event.uniqueUserCountAllCharacters || 1);
      } else if (event.type === 'value') {
        totalUniqueUsers = event.uniqueUserCountAllValues || 0;
        avgPerUser = totalCount / (event.uniqueUserCountAllValues || 1);
      } else {
        totalUniqueUsers = event.items.reduce((sum, item) => sum + item.uniqueUserCount, 0);
        avgPerUser = totalCount / totalUniqueUsers;
      }
      
      return { totalCount, totalUniqueUsers, avgPerUser };
    }
    
    const avgPerUser = event.count! / (event.uniqueUserCount || 1);
    return { 
      totalCount: event.count!, 
      totalUniqueUsers: event.uniqueUserCount!,
      avgPerUser 
    };
  };

  const { totalCount, totalUniqueUsers, avgPerUser } = calculateMetrics();
  const styles = getEventStyle(event.type);
  const barWidth = `${(avgPerUser / maxAvgPerUser) * 100}%`;

  return (
    <div ref={setNodeRef} style={style}>
      <div className={`
        relative ${styles.bg} transition-colors
        border ${styles.border} shadow-sm rounded-lg mb-2 overflow-hidden
      `}>
        <div 
          className={`absolute left-0 top-0 bottom-0 ${styles.bar} transition-all duration-500`} 
          style={{ width: barWidth }}
        />
        
        <div className={`
          relative p-4 flex items-center ${event.items && !isHidden ? 'cursor-pointer' : ''}
        `} onClick={event.items && !isHidden ? onToggle : undefined}>
          {!isHidden && (
            <button
              className="mr-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex-1 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <div className="flex items-center">
                {event.items && !isHidden && (
                  <button className="mr-2">
                    {isExpanded ? 
                      <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                )}
                {getIcon(event.type)}
                <div className={`font-medium ${isHidden ? 'text-gray-500' : 'text-gray-900'}`}>
                  {event.name}
                </div>
              </div>
            </div>
            <div className="col-span-3 text-right flex items-center justify-end">
              <Activity className={`w-4 h-4 mr-2 ${isHidden ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`font-medium ${isHidden ? 'text-gray-500' : ''}`}>
                {totalCount.toLocaleString()}
              </span>
            </div>
            <div className="col-span-3 text-right flex items-center justify-end">
              <Users className={`w-4 h-4 mr-2 ${isHidden ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`font-medium ${isHidden ? 'text-gray-500' : ''}`}>
                {totalUniqueUsers.toLocaleString()}
              </span>
            </div>
            <div className="col-span-2 text-right flex items-center justify-end gap-2">
              <span className={`font-medium ${isHidden ? 'text-gray-500' : 'text-gray-700'}`}>
                {avgPerUser.toFixed(1)} avg
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHide();
                }}
                className="p-1 rounded hover:bg-black/5 transition-colors"
              >
                {isHidden ? (
                  <Eye className="w-4 h-4 text-gray-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {event.items && isExpanded && !isHidden && (
          <div className="relative border-t border-gray-100 bg-white/80 rounded-b-lg">
            {event.items.map((item, index) => {
              const itemAvgPerUser = item.count / (item.uniqueUserCount || 1);
              const itemBarWidth = `${(itemAvgPerUser / maxAvgPerUser) * 100}%`;
              
              return (
                <div 
                  key={item.name}
                  className={`
                    relative px-4 py-3 flex items-center
                    ${index !== event.items!.length - 1 ? 'border-b border-gray-100' : ''}
                  `}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 ${styles.bar} opacity-50 transition-all duration-500`}
                    style={{ width: itemBarWidth }}
                  />
                  <div className="relative flex-1 grid grid-cols-12 gap-4 items-center pl-12">
                    <div className="col-span-4">
                      <span className="text-sm font-medium text-gray-600">{item.name}</span>
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="text-sm">{item.count.toLocaleString()}</span>
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="text-sm">{item.uniqueUserCount.toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm">{itemAvgPerUser.toFixed(1)} avg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};