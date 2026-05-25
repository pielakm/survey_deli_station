/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

interface MarkerProps {
  lat: number;
  lng: number;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
  name: string;
}

const Marker: React.FC<MarkerProps> = ({ lat, lng, isCompleted, isActive, onClick, name }) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex flex-col items-center" style={{ transform: 'translate(-50%, -100%)' }}>
      <div className={`
        transition-all duration-300 transform
        ${isActive ? 'scale-125 -translate-y-2' : 'scale-100'}
      `}>
        <MapPin 
          size={32} 
          className={`${
            isCompleted 
              ? 'text-emerald-500 fill-emerald-100' 
              : isActive 
                ? 'text-emerald-700 fill-emerald-200' 
                : 'text-emerald-800 fill-emerald-50' 
          } drop-shadow-lg`}
        />
      </div>
      {isActive && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-emerald-400 animate-ping" />
      )}
    </div>
  );

  const customIcon = L.divIcon({
    html: iconMarkup,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <LeafletMarker 
      position={[lat, lng]} 
      icon={customIcon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
};

export default Marker;

