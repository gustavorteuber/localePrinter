import { useState, useEffect } from 'react';

const useGeolocation = (isRunning) => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    let watchId;

    if (isRunning && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPositions((prevPositions) => [...prevPositions, [latitude, longitude]]);
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isRunning]);

  return positions;
};

export default useGeolocation;
