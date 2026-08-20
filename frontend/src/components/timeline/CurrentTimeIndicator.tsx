import React from 'react';
import { useCurrentTime } from '../../hooks/useCurrentTime';

interface CurrentTimeIndicatorProps {
  hourHeight: number;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ hourHeight }) => {
  const now = useCurrentTime();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const top = (hours + minutes / 60) * hourHeight;

  return (
    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top }}>
      <div className="flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1" />
        <div className="flex-1 h-[2px] bg-red-500" />
      </div>
    </div>
  );
};

export default CurrentTimeIndicator;
