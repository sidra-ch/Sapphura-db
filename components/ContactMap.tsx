"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ContactMap() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      });
    }
  }, []);

  return (
    <div className="bg-[#0a1535] p-4 rounded-2xl border border-gold/20">
      <h2 className="text-2xl font-bold text-gold mb-6">Find Us on Map</h2>
      <div className="h-[400px] rounded-xl overflow-hidden">
        <MapContainer 
          center={[33.5651, 73.0169]} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[33.5651, 73.0169]} icon={customIcon}>
            <Popup>
              <div className="text-gray-900">
                <strong>Sapphura</strong><br />
                Nadir Plaza, 35 Shop<br />
                5th Road Commercial Market<br />
                D Block, Satellite Town<br />
                Rawalpindi, Pakistan
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
