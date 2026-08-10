'use client'; // if using Next.js 13+ with app router

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

export default function Map() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <div className="h-200 w-full rounded-3xl">
      <MapContainer
        center={[-25.746, 28.188]} // Pretoria area
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
