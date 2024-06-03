import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ positions }) => {
  const calculateCenter = () => {
    if (positions.length === 0) {
      return [51.505, -0.09];
    }

    const latitudes = positions.map(([lat, lng]) => lat);
    const longitudes = positions.map(([lat, lng]) => lng);
    const avgLat = latitudes.reduce((a, b) => a + b, 0) / positions.length;
    const avgLng = longitudes.reduce((a, b) => a + b, 0) / positions.length;

    return [avgLat, avgLng];
  };

  return (
    <MapContainer center={calculateCenter()} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.length > 1 && <Polyline positions={positions} />}
    </MapContainer>
  );
};

export default Map;
