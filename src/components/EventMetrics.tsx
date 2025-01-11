import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { MessageCircle, Sparkles, Hash, EyeOff, Eye, Users } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableEvent } from './SortableEvent';
import type { AnalyticsData } from '../types/analytics';
import type { EventItem } from './types';

interface EventMetricsProps {
  data: AnalyticsData;
  stage: 'anonymous' | 'signedUp' | 'purchased';
}

export const EventMetrics: React.FC<EventMetricsProps> = ({ data, stage }) => {
  const eventMetrics = data.eventMetrics?.[stage] || { characterEvents: {}, valueEvents: {} };
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [hiddenEvents, setHiddenEvents] = useState<string[]>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Process character events
  const characterEvents = Object.entries(eventMetrics.characterEvents || {}).map(([eventName, eventData]) => {
    // Extract uniqueUserCountAllCharacters and the character-specific data
    const { uniqueUserCountAllCharacters, ...characters } = eventData;
    
    return {
      id: `character-${eventName}`,
      type: 'character' as const,
      name: eventName,
      uniqueUserCountAllCharacters: uniqueUserCountAllCharacters || 0,
      items: Object.entries(characters).map(([character, data]) => ({
        name: character,
        count: data.count || 0,
        uniqueUserCount: data.uniqueUserCount || 0,
        lastInteraction: data.lastInteractionDate
      })).filter(item => item.count > 0)
    };
  }).filter(event => event.items.length > 0);

  // Process value events
  const valueEvents = Object.entries(eventMetrics.valueEvents || {}).map(([eventName, eventData]) => {
    // Extract uniqueUserCountAllValues and the value-specific data
    const { uniqueUserCountAllValues, ...values } = eventData;
    
    return {
      id: `value-${eventName}`,
      type: 'value' as const,
      name: eventName,
      uniqueUserCountAllValues: uniqueUserCountAllValues || 0,
      items: Object.entries(values).map(([value, data]) => ({
        name: value,
        count: data.count || 0,
        uniqueUserCount: data.uniqueUserCount || 0
      }))
    };
  });

  // Process simple events
  const simpleEvents = Object.entries(eventMetrics.simpleEvents || {}).map(([name, data]) => ({
    id: `simple-${name}`,
    type: 'simple' as const,
    name,
    count: data.count || 0,
    uniqueUserCount: data.uniqueUserCount || 0
  }));

  const events: EventItem[] = [...characterEvents, ...valueEvents, ...simpleEvents];
  const [items, setItems] = useState(events);
  const visibleItems = items.filter(item => !hiddenEvents.includes(item.id));

  if (visibleItems.length === 0) {
    return (
      <DashboardCard title={`${stage.charAt(0).toUpperCase() + stage.slice(1)} Stage Events`}>
        <div className="flex items-center justify-center h-32 text-gray-500">
          No event data available
        </div>
      </DashboardCard>
    );
  }

  // Calculate max average per user for bar scaling
  const maxAvgPerUser = Math.max(
    ...visibleItems.map(event => {
      if ('items' in event) {
        const totalCount = event.items.reduce((sum, item) => sum + item.count, 0);
        if (event.type === 'character') {
          return totalCount / (event.uniqueUserCountAllCharacters || 1);
        } else if (event.type === 'value') {
          return totalCount / (event.uniqueUserCountAllValues || 1);
        }
        return 0;
      }
      return event.count / (event.uniqueUserCount || 1);
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleEventVisibility = (eventId: string) => {
    setHiddenEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <DashboardCard title={`${stage.charAt(0).toUpperCase() + stage.slice(1)} Stage Events`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <div className="flex items-center text-sm">
            <MessageCircle className="w-4 h-4 mr-1 text-purple-500" />
            <span className="text-purple-700">Character Events</span>
          </div>
          <div className="flex items-center text-sm">
            <Sparkles className="w-4 h-4 mr-1 text-blue-500" />
            <span className="text-blue-700">Value Events</span>
          </div>
          <div className="flex items-center text-sm">
            <Hash className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-700">Simple Events</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {visibleItems.length} of {items.length} events
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-12 gap-4 px-4 text-sm font-medium text-gray-600">
        <div className="col-span-4">Event Details</div>
        <div className="col-span-3 text-right">Count</div>
        <div className="col-span-3 text-right">Unique Users</div>
        <div className="col-span-2 text-right">Avg/User</div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {visibleItems.map((event) => (
              <SortableEvent
                key={event.id}
                event={event}
                isExpanded={expandedEvents.includes(event.id)}
                onToggle={() => toggleEvent(event.id)}
                onHide={() => toggleEventVisibility(event.id)}
                maxAvgPerUser={maxAvgPerUser}
                isHidden={false}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {hiddenEvents.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Hidden Events</h3>
          <div className="space-y-2">
            {items
              .filter(item => hiddenEvents.includes(item.id))
              .map(event => (
                <SortableEvent
                  key={event.id}
                  event={event}
                  isExpanded={false}
                  onToggle={() => {}}
                  onHide={() => toggleEventVisibility(event.id)}
                  maxAvgPerUser={maxAvgPerUser}
                  isHidden={true}
                />
              ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
};