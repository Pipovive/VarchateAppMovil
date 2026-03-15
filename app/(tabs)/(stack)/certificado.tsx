import { BASE_URL } from '@/src/api/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CertificadoScreen = () => {
    const [imageLoading, setImageLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [descargando, setDescargando] = useState(false);
    const router = useRouter();
    const { codigo, modulo, porcentaje, fecha } = useLocalSearchParams<{
        codigo: string;
        modulo: string;
        porcentaje: string;
        fecha: string;
    }>();
    const insets = useSafeAreaInsets();
    const [imageError, setImageError] = useState(false);
    const urlImagen = `${BASE_URL}/certificaciones/${codigo}/ver`;
    const urlDescargar = `${BASE_URL}/certificaciones/${codigo}/descargar`;

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
            setLoading(false);
        };
        loadToken();
    }, []);

    const handleDescargar = async () => {
        if (!token) {
            Alert.alert('Error', 'No se pudo obtener el token de autenticación.', [{ text: 'Aceptar' }]);
            return;
        }

        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para guardar el certificado.', [{ text: 'Aceptar' }]);
                return;
            }

            setDescargando(true);

            const fileUri = `${FileSystem.cacheDirectory}certificado-${codigo}.jpg`;

            const downloadResult = await FileSystem.downloadAsync(
                urlDescargar,
                fileUri,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (downloadResult.status !== 200) {
                Alert.alert('Error', 'No se pudo descargar el certificado.', [{ text: 'Aceptar' }]);
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
            await MediaLibrary.createAlbumAsync('Certificados', asset, false);

            Alert.alert('✅ Guardado', 'Certificado guardado en tu galería en el álbum "Certificados".', [{ text: 'Aceptar' }]);
        } catch (err) {
            console.error('❌ Error descargando:', err);
            Alert.alert('Error', 'No se pudo descargar el certificado.', [{ text: 'Aceptar' }]);
        } finally {
            setDescargando(false);
        }
    };

    const handleCompartir = () => {
        Linking.openURL(urlImagen).catch(() =>
            Alert.alert('Error', 'No se pudo abrir el certificado.')
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0A1628', paddingTop: insets.top }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#C9A227" />
                    <Text style={{ color: '#FFFFFF', marginTop: 16 }}>Cargando certificado...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#0A1628', paddingTop: insets.top }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Barlow-Bold' }}>
                    Mi Certificado
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={{ backgroundColor: '#C9A227', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 28 }}>🏆</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginTop: 8, fontFamily: 'Barlow-Bold' }}>
                        {modulo}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#FFF8E7', marginTop: 4 }}>
                        Calificación: {porcentaje}% · {fecha}
                    </Text>
                </View>

                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20, elevation: 4 }}>
                    {!imageError && token ? (
                        <View style={{ width: '100%', height: 220 }}>
                            {imageLoading && (
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: '#F9FAFB', zIndex: 1
                                }}>
                                    <ActivityIndicator size="large" color="#C9A227" />
                                    <Text style={{ color: '#6B7280', marginTop: 8, fontSize: 13 }}>
                                        Cargando certificado...
                                    </Text>
                                </View>
                            )}
                            <Image
                                source={{
                                    uri: urlImagen,
                                    headers: { Authorization: `Bearer ${token}` }
                                }}
                                style={{ width: '100%', height: 220 }}
                                resizeMode="contain"
                                onLoadStart={() => setImageLoading(true)}
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageLoading(false);
                                    setImageError(true);
                                }}
                            />
                        </View>
                    ) : (
                        <View style={{ height: 220, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 40 }}>📜</Text>
                            <Text style={{ color: '#6B7280', marginTop: 8 }}>
                                {imageError ? 'No se pudo cargar la imagen' : 'Cargando imagen...'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ backgroundColor: '#1E2D45', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#2A3F5F' }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 4 }}>Código de verificación</Text>
                    <Text style={{ color: '#C9A227', fontSize: 14, fontFamily: 'Barlow-Bold', letterSpacing: 1 }}>{codigo}</Text>
                </View>

                <View style={{ gap: 12 }}>
                    <TouchableOpacity
                        onPress={handleDescargar}
                        disabled={descargando}
                        style={{ backgroundColor: descargando ? '#6B7280' : '#10B981', paddingVertical: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                        {descargando
                            ? <ActivityIndicator size="small" color="#FFFFFF" />
                            : <Ionicons name="download" size={20} color="#FFFFFF" />
                        }
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, fontFamily: 'Barlow-Bold' }}>
                            {descargando ? 'Descargando...' : 'Descargar Certificado'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleCompartir}
                        style={{ backgroundColor: '#1E2D45', paddingVertical: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#C9A227' }}
                    >
                        <Ionicons name="open-outline" size={20} color="#C9A227" />
                        <Text style={{ color: '#C9A227', fontWeight: 'bold', fontSize: 16, fontFamily: 'Barlow-Bold' }}>
                            Ver en Navegador
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default CertificadoScreen;