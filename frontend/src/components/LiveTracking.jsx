import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
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

const LiveTracking = ({ className = "h-screen w-full", pickupCoords = null, destinationCoords = null, isCaptain = false }) => {
    const [currentPosition, setCurrentPosition] = useState({ lat: 22.5726, lng: 88.3639 }); // Default: Kolkata

    // Debug coordinates
    console.log('LiveTracking - pickupCoords:', pickupCoords);
    console.log('LiveTracking - destinationCoords:', destinationCoords);

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

    // Calculate center position based on available coordinates
    const getCenterPosition = () => {
        if (pickupCoords && destinationCoords) {
            return {
                lat: (pickupCoords.lat + destinationCoords.lat) / 2,
                lng: (pickupCoords.lng + destinationCoords.lng) / 2
            };
        } else if (pickupCoords) {
            return pickupCoords;
        } else if (destinationCoords) {
            return destinationCoords;
        }
        return currentPosition;
    };

    const centerPosition = getCenterPosition();

    return (
        <div className={className}>
            <MapContainer center={centerPosition} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                
                {/* Current position marker (for both user and captain) */}
                <Marker 
                    position={currentPosition}
                    icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: ${isCaptain ? '#3B82F6' : '#10B981'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${isCaptain ? 'C' : 'U'}</div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })}
                />
                
                {/* Pickup marker */}
                {pickupCoords && (
                    <Marker 
                        position={pickupCoords}
                        icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: '<div style="background-color: #4CAF50; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">P</div>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })}
                    />
                )}
                
                {/* Destination marker */}
                {destinationCoords && (
                    <Marker 
                        position={destinationCoords}
                        icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: '<div style="background-color: #F44336; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">D</div>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })}
                    />
                )}
                
                {/* Route line between pickup and destination */}
                {pickupCoords && destinationCoords && (
                    <Polyline
                        positions={[pickupCoords, destinationCoords]}
                        color="#8B5CF6"
                        weight={4}
                        opacity={0.8}
                    />
                )}
                
                <UpdateMapCenter position={centerPosition} />
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
