import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import type { Coordinates } from '../types';

const DEFAULT_COORDS: Coordinates = { latitude: 30.3935, longitude: -87.1394 }; // Pensacola, FL

export function useLocation() {
  const [coords, setCoords] = useState<Coordinates>(DEFAULT_COORDS);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }
      setPermissionGranted(true);
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  return { coords, permissionGranted, error };
}
