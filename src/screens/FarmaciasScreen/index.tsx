import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Keyboard } from 'react-native';
import MapView, { MapPressEvent, Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import type {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from './styles';
import { Header } from '../../components';
import { useAuth } from '../../context/auth';

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ??
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

type LatLng = { latitude: number; longitude: number };

function decodePolyline(encoded: string): LatLng[] {
  let index = 0;
  const length = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates: LatLng[] = [];

  while (index < length) {
    let result = 0;
    let shift = 0;
    let b: number;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    result = 0;
    shift = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coordinates;
}

export function FarmaciasScreen() {
  const { user } = useAuth();
  const mapRef = useRef<MapView | null>(null);
  const placesRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [hasAccurateLocation, setHasAccurateLocation] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);

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
      console.warn('Falha ao obter localização:', error);
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

  const originCoordinate = useMemo<LatLng>(() => {
    return userLocation ?? { latitude: region.latitude, longitude: region.longitude };
  }, [region.latitude, region.longitude, userLocation]);

  useEffect(() => {
    if (!mapRef.current || !destination) {
      return;
    }

    mapRef.current.fitToCoordinates(
      [
        originCoordinate,
        { latitude: destination.latitude, longitude: destination.longitude },
      ],
      {
        edgePadding: { top: 120, right: 40, bottom: 120, left: 40 },
        animated: true,
      }
    );
  }, [destination, originCoordinate]);

  const handleMapPress = useCallback((event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDestination({
      latitude,
      longitude,
      description: 'Local selecionado',
    });
    setRouteError(null);
    setRouteCoordinates([]);
  }, []);

  const handlePlaceSelect = useCallback((data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    const location = details?.geometry?.location;

    if (!location) {
      setRouteError('Não foi possível obter o endereço selecionado.');
      return;
    }

    setDestination({
      latitude: Number(location.lat),
      longitude: Number(location.lng),
      description: data.description ?? 'Destino selecionado',
    });

    setRouteError(null);
    setRouteCoordinates([]);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  }, []);

  const handleClearDestination = useCallback(() => {
    setDestination(null);
    setRouteError(null);
    setRouteCoordinates([]);
    placesRef.current?.setAddressText('');
    setIsSearchFocused(false);
    Keyboard.dismiss();
  }, []);

  const markerCoordinate = useMemo(() => {
    if (destination) {
      return { latitude: destination.latitude, longitude: destination.longitude };
    }
    if (userLocation) {
      return userLocation;
    }
    return null;
  }, [destination, userLocation]);

  useEffect(() => {
    if (!destination || !GOOGLE_API_KEY) {
      setRouteCoordinates([]);
      return;
    }

    const currentDestination = destination;
    const currentOrigin = originCoordinate;
    const controller = new AbortController();

    async function fetchRoute() {
      try {
        const origin = `${currentOrigin.latitude},${currentOrigin.longitude}`;
        const dest = `${currentDestination.latitude},${currentDestination.longitude}`;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&mode=driving&key=${encodeURIComponent(GOOGLE_API_KEY)}`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          setRouteError(`Falha ao consultar rota (HTTP ${response.status}).`);
          setRouteCoordinates([]);
          return;
        }

        const json = await response.json();

        if (json.status !== 'OK') {
          const message = json.error_message
            ? `${json.status}: ${json.error_message}`
            : String(json.status ?? 'Erro ao traçar rota.');
          setRouteError(message);
          setRouteCoordinates([]);
          return;
        }

        const points = json.routes?.[0]?.overview_polyline?.points;

        if (typeof points !== 'string' || points.length === 0) {
          setRouteError('Rota indisponível para o destino selecionado.');
          setRouteCoordinates([]);
          return;
        }

        const coords = decodePolyline(points);
        setRouteError(null);
        setRouteCoordinates(coords);

        if (coords.length > 0) {
          mapRef.current?.fitToCoordinates(coords, {
            edgePadding: { top: 160, right: 40, bottom: 140, left: 40 },
            animated: true,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.warn('Erro ao consultar rota:', error);
        setRouteError('Não foi possível traçar a rota.');
        setRouteCoordinates([]);
      }
    }

    fetchRoute();

    return () => controller.abort();
  }, [
    destination?.latitude,
    destination?.longitude,
    originCoordinate.latitude,
    originCoordinate.longitude,
  ]);

  const handleOpenInGoogleMaps = useCallback(() => {
    if (!destination) {
      return;
    }

    const originParam = userLocation ? `&origin=${userLocation.latitude},${userLocation.longitude}` : '';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}${originParam}&travelmode=driving`;
    Linking.openURL(url).catch((error) => console.warn('Falha ao abrir Google Maps:', error));
  }, [destination, userLocation]);

  return (
    <View style={styles.container}>
      <Header title="FARMÁCIAS" />

      <View style={styles.mapContainer}>
        {GOOGLE_API_KEY ? (
          <View style={styles.searchContainer} pointerEvents="auto">
            <GooglePlacesAutocomplete
              ref={placesRef}
              placeholder="Pesquisar locais"
              fetchDetails
              GooglePlacesDetailsQuery={{ fields: 'geometry,name,formatted_address' }}
              enablePoweredByContainer={false}
              debounce={250}
              nearbyPlacesAPI="GooglePlacesSearch"
              listViewDisplayed="auto"
              keepResultsAfterBlur
              keyboardShouldPersistTaps="always"
              onPress={handlePlaceSelect}
              onFail={(error) => {
                console.warn('Places autocomplete error:', error);
                setRouteError('Falha ao buscar local. Verifique sua chave e permissões.');
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: 'pt-BR',
                components: 'country:br',
              }}
              styles={{
                container: styles.searchInnerContainer,
                textInputContainer: styles.searchInputContainer,
                textInput: styles.searchInput,
                listView: styles.searchListView,
                row: styles.searchRow,
                description: styles.searchDescription,
                separator: styles.searchSeparator,
              }}
              textInputProps={{
                onFocus: () => setIsSearchFocused(true),
                onBlur: () => setIsSearchFocused(false),
                placeholderTextColor: '#666',
                returnKeyType: 'search',
              }}
              renderRightButton={() =>
                destination ? (
                  <TouchableOpacity
                    style={styles.searchIconButton}
                    onPress={handleClearDestination}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar destino"
                  >
                    <Ionicons name="close" size={18} color="#111" />
                  </TouchableOpacity>
                ) : null
              }
            />
            {routeError ? (
              <View style={styles.routeErrorPill}>
                <Ionicons name="alert-circle-outline" size={16} color="#B00020" />
                <Text style={styles.routeErrorText}>{routeError}</Text>
              </View>
            ) : destination ? (
              <View style={styles.routeErrorPill}>
                <Ionicons name="location-outline" size={16} color="#111" />
                <Text style={styles.routeErrorText}>
                  {destination.description}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          loadingEnabled
          onPress={handleMapPress}
        >
          {markerCoordinate ? (
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
          ) : null}

          {routeCoordinates.length > 0 ? (
            <Polyline coordinates={routeCoordinates} strokeColor="#4285F4" strokeWidth={5} />
          ) : null}
        </MapView>

        {destination ? (
          <View style={styles.mapsButtonContainer} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.mapsButton}
              onPress={handleOpenInGoogleMaps}
              accessibilityRole="button"
              accessibilityLabel="Abrir rota no Google Maps"
            >
              <Ionicons name="navigate" size={18} color="#111" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}
