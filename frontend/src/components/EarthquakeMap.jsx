import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

const EarthquakeMap = ({ earthquakes = [], height = "450px" }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);
  const navigate = useNavigate();
  const [mapTheme, setMapTheme] = useState('voyager'); // 'voyager' (light/detailed), 'dark_all' (dark)

  // Color helper based on magnitude
  const getMarkerColor = (mag) => {
    if (mag >= 6.5) return '#dc2626'; // Red-600
    if (mag >= 5.5) return '#ea580c'; // Orange-600
    if (mag >= 4.8) return '#d97706'; // Amber-600
    return '#059669'; // Emerald-600
  };

  // Radius helper based on magnitude
  const getMarkerRadius = (mag) => {
    // Standardize scaling for magnitude range (4.5 to 9.0+)
    const baseRadius = (mag - 4) * 6;
    return Math.max(6, Math.min(24, baseRadius));
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet Map instance
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 12,
      worldCopyJump: true,
      zoomControl: false // Add zoom control manually in custom position
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    // Create LayerGroup for markers
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Add popup navigation event listener
    map.on('popupopen', (e) => {
      const container = e.popup.getElement();
      if (!container) return;
      const btn = container.querySelector('.view-details-btn');
      if (btn) {
        const id = btn.getAttribute('data-id');
        // Clear any old click listeners
        btn.onclick = (event) => {
          event.preventDefault();
          navigate(`/earthquakes/${id}`);
        };
      }
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [navigate]);

  // 2. Handle Tile Layer changes (Light vs Dark theme toggle)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add CartoDB tile layer based on selected theme
    const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/${mapTheme}/{z}/{x}/{y}{r}.png`;
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

    L.tileLayer(tileUrl, { attribution }).addTo(map);
  }, [mapTheme]);

  // 3. Handle Markers Redraw on Earthquakes list update
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    // Clear existing markers
    layerGroup.clearLayers();

    if (!earthquakes || earthquakes.length === 0) return;

    const bounds = [];

    earthquakes.forEach((eq) => {
      const coordinates = eq.geometry?.coordinates || eq.coordinates;
      if (!coordinates || coordinates.length < 2) return;

      // coordinates in GeoJSON are [longitude, latitude]
      // Leaflet uses [latitude, longitude]
      const lat = coordinates[1];
      const lng = coordinates[0];

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      const color = getMarkerColor(eq.mag);
      const radius = getMarkerRadius(eq.mag);
      const isStrong = eq.mag >= 6.0;

      // Custom popup HTML string
      const date = new Date(eq.time).toLocaleString();
      const popupContent = `
        <div class="p-2 space-y-2 text-slate-100 min-w-[200px]">
          <div class="flex justify-between items-center border-b border-slate-700/60 pb-1">
            <span class="text-xs text-slate-400 font-medium">${eq.place || 'Unknown Location'}</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold text-white" style="background-color: ${color}">
              ${eq.mag.toFixed(1)} M
            </span>
          </div>
          <div class="text-xs space-y-1 text-slate-350">
            <p><strong>Depth:</strong> ${eq.depth || eq.geometry?.coordinates[2] || 0} km</p>
            <p><strong>Time:</strong> ${date}</p>
          </div>
          <button 
            data-id="${eq._id || eq.id}" 
            class="view-details-btn w-full mt-2 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center block border-none"
          >
            View Full Analysis
          </button>
        </div>
      `;

      // Create vector circle marker
      const marker = L.circleMarker([lat, lng], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.85,
        fillOpacity: 0.7,
        className: isStrong ? 'pulse-marker' : ''
      });

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
        maxWidth: 260
      });

      // Simple hover tooltip
      marker.bindTooltip(`<strong>${eq.mag.toFixed(1)} M</strong> - ${eq.place || 'Seismic Event'}`, {
        direction: 'top',
        className: 'bg-slate-900 border-slate-700 text-white rounded px-2 py-1 text-xs font-sans shadow-lg'
      });

      layerGroup.addLayer(marker);
    });

    // Auto-adjust bounds to show all markers with padding
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 5);
      } else {
        map.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 7
        });
      }
    }
  }, [earthquakes]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 map-fade-in">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex space-x-2">
        <button
          onClick={() => setMapTheme('voyager')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm border transition-all ${
            mapTheme === 'voyager'
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Light Map
        </button>
        <button
          onClick={() => setMapTheme('dark_all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm border transition-all ${
            mapTheme === 'dark_all'
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-750'
          }`}
        >
          Dark Map
        </button>
      </div>

      {/* Map Container DOM Element */}
      <div 
        ref={mapContainerRef} 
        style={{ height }} 
        className="w-full relative"
      />
    </div>
  );
};

export default EarthquakeMap;
