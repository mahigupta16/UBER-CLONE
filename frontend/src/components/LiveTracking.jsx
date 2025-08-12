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

const FitBoundsOnData = ({ pickupCoords, stopsCoords, destinationCoords }) => {
    const map = useMap();
    useEffect(() => {
        const points = [];
        if (pickupCoords) points.push([pickupCoords.lat, pickupCoords.lng]);
        if (Array.isArray(stopsCoords)) points.push(...stopsCoords.map(p => [p.lat, p.lng]));
        if (destinationCoords) points.push([destinationCoords.lat, destinationCoords.lng]);
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    // Only refit when the route changes, not on every position update
    }, [
        pickupCoords?.lat, pickupCoords?.lng,
        destinationCoords?.lat, destinationCoords?.lng,
        JSON.stringify(stopsCoords || [])
    ]);
    return null;
};

const LiveTracking = ({ className = "h-screen w-full", pickupCoords = null, destinationCoords = null, stopsCoords = [], isCaptain = false, scrollWheelZoom = true, zoomControl = true }) => {
    const [currentPosition, setCurrentPosition] = useState({ lat: 22.5726, lng: 88.3639 }); // Default: Kolkata

    // Debug coordinates
    console.log('LiveTracking - pickupCoords:', pickupCoords);
    console.log('LiveTracking - stopsCoords:', stopsCoords);
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
        const points = [];
        if (pickupCoords) points.push(pickupCoords);
        if (Array.isArray(stopsCoords)) points.push(...stopsCoords);
        if (destinationCoords) points.push(destinationCoords);
        if (points.length >= 2) {
            const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
            const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;
            return { lat: avgLat, lng: avgLng };
        }
        return points[0] || currentPosition;
    };

    const centerPosition = getCenterPosition();

    return (
        <div className={className}>
            <MapContainer center={centerPosition} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }} scrollWheelZoom={true} zoomControl={true} dragging={true} doubleClickZoom={true}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />

                {/* Current position marker (for both user and captain) */}
                <Marker
                    position={currentPosition}
                    icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style=\"background-color: ${isCaptain ? '#3B82F6' : '#84CC16'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);\">${isCaptain ? 'C' : 'U'}</div>`,
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
                            html: '<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">P</div>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })}
                    />
                )}

                {/* Stops markers */}
                {Array.isArray(stopsCoords) && stopsCoords.map((pos, i) => (
                    <Marker key={`stop-${i}`}
                        position={pos}
                        icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div style=\"background-color: #F59E0B; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);\">${i + 1}</div>`,
                            iconSize: [28, 28],
                            iconAnchor: [14, 14]
                        })}
                    />
                ))}

                {/* Destination marker */}
                {destinationCoords && (
                    <Marker
                        position={destinationCoords}
                        icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: '<div style="background-color: #84CC16; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">D</div>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })}
                    />
                )}

                {/* Route line through pickup -> stops -> destination */}
                {(pickupCoords || destinationCoords || (stopsCoords?.length)) && (
                    <Polyline
                        positions={[
                            ...(pickupCoords ? [pickupCoords] : []),
                            ...((Array.isArray(stopsCoords) ? stopsCoords : [])),
                            ...(destinationCoords ? [destinationCoords] : [])
                        ]}
                        color="#3B82F6"
                        weight={4}
                        opacity={0.8}
                    />
                )}

                <FitBoundsOnData pickupCoords={pickupCoords} stopsCoords={stopsCoords} destinationCoords={destinationCoords} />
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
