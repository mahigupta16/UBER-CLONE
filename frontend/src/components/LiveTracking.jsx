import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Default marker fix (Leaflet doesn't load icons correctly in React by default)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UpdateMapCenter = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position]);
    return null;
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({ lat: 22.5726, lng: 88.3639 }); // Default: Kolkata

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div className="h-screen w-full">
            <MapContainer center={currentPosition} zoom={15}  style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                <Marker position={currentPosition} />
                <UpdateMapCenter position={currentPosition} />
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
