import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { styles } from './styles';
import { Header } from '../../components';
import { useAuth } from '../../context/auth';

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
  process.env.EXPO_PUBLIC_GOOGLE_PLACES ??
  '';

const DEFAULT_REGION: Region = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type Destination = {
  latitude: number;
  longitude: number;
  description: string;
};

export function FarmaciasScreen() {
  const { user } = useAuth();
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [hasAccurateLocation, setHasAccurateLocation] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const userRegion = useMemo(() => {
    const lat = user?.latitude;
    const lon = user?.longitude;

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      const parsed = {
        latitude: Number(lat),
        longitude: Number(lon),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      } satisfies Region;
      return parsed;
    }

    return null;
  }, [user?.latitude, user?.longitude]);

  const requestAndCenterOnLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setRegion((current) => ({
        ...current,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setHasAccurateLocation(true);
    } catch (error) {
      console.warn('Falha ao obter localizacao:', error);
    }
  }, []);

  useEffect(() => {
    if (userRegion) {
      setRegion(userRegion);
      setUserLocation({
        latitude: userRegion.latitude,
        longitude: userRegion.longitude,
      });
      setHasAccurateLocation(true);
    } else {
      requestAndCenterOnLocation();
    }
  }, [requestAndCenterOnLocation, userRegion]);

  useEffect(() => {
    if (!mapRef.current || !destination) {
      return;
    }

    const originCoordinate =
      userLocation ?? { latitude: region.latitude, longitude: region.longitude };

    mapRef.current.fitToCoordinates(
      [
        originCoordinate,
        { latitude: destination.latitude, longitude: destination.longitude },
      ],
      {
        edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
        animated: true,
      }
    );
  }, [destination, region.latitude, region.longitude, userLocation]);

  const handleMapPress = useCallback((event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDestination({
      latitude,
      longitude,
      description: 'Local selecionado',
    });
  }, []);

  const markerCoordinate = useMemo(() => {
    if (destination) {
      return {
        latitude: destination.latitude,
        longitude: destination.longitude,
      };
    }
    if (userLocation) {
      return userLocation;
    }
    return null;
  }, [destination, userLocation]);

  const handleOpenInGoogleMaps = useCallback(() => {
    if (!destination) {
      return;
    }

    const originParam = userLocation
      ? `&origin=${userLocation.latitude},${userLocation.longitude}`
      : '';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}${originParam}&travelmode=driving`;
    Linking.openURL(url).catch((error) =>
      console.warn('Falha ao abrir Google Maps:', error)
    );
  }, [destination, userLocation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="FARMÁCIAS" />

      {/* Mapa com localização atual */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          loadingEnabled
          onPress={handleMapPress}
        >
          {markerCoordinate && (
            <Marker
              coordinate={markerCoordinate}
              title={
                destination
                  ? destination.description
                  : hasAccurateLocation
                    ? 'Você está aqui'
                    : 'Localização aproximada'
              }
              description={
                destination
                  ? 'Destino selecionado'
                  : hasAccurateLocation
                    ? 'Localização atual'
                    : 'Centralizado em uma região padrão'
              }
              pinColor={destination ? '#FF6F61' : undefined}
            />
          )}
          {destination && (
            <>
              {GOOGLE_API_KEY ? (
                <MapViewDirections
                  origin={
                    userLocation ?? {
                      latitude: region.latitude,
                      longitude: region.longitude,
                    }
                  }
                  destination={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  }}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={5}
                  strokeColor="#4285F4"
                  mode="DRIVING"
                  onError={(errMessage) => console.warn('Erro ao traçar rota:', errMessage)}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </MapView>
        {destination && (
          <View style={styles.mapsButtonContainer}>
            <TouchableOpacity style={styles.mapsButton} onPress={handleOpenInGoogleMaps}>
              <Text style={styles.mapsButtonText}>Abrir no Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
