import { useState } from 'react';
import { generarCertificacion, getMisCertificaciones } from '../api/api';
import {
    CertificacionData,
    GenerarCertificacionResponse,
} from '../services/Certificacionservices';
export const useCertificacionViewModel = () => {
    const [certificaciones, setCertificaciones] = useState<CertificacionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCertificaciones = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMisCertificaciones();
            if (response.success) {
                setCertificaciones(response.data.certificaciones);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener certificaciones');
        } finally {
            setLoading(false);
        }
    };

    const generar = async (moduloId: number): Promise<GenerarCertificacionResponse> => {
        try {
            setGenerating(true);
            setError(null);
            const response = await generarCertificacion(moduloId);

          
            // Caso: ya tiene certificado
            console.log('RESPONSE EN VIEWMODEL:', JSON.stringify(response));
            console.log('success:', response.success, 'codigo_existente:', response.data?.codigo_existente); // ← AGREGA
            if (response.data?.codigo_existente) {  // ← sin importar success
                 console.log('🔑 ENTRANDO AL IF - codigo:', response.data.codigo_existente); // ← AGREGA
                const codigo = response.data.codigo_existente;
                return {
                    codigo_certificado: codigo,
                    usuario: '',
                    modulo: '',
                    porcentaje: 0,
                    fecha_emision: '',
                    urls: {
                        ver_imagen: response.data.url,
                        descargar: response.data.url.replace('/ver', '/descargar'),
                        verificar: response.data.url.replace('/ver', '/verificar'),
                    },
                };
            }

            if (response.success) {
                await fetchCertificaciones();
                return response.data;
            }

            throw new Error(response.message || 'Error al generar certificación');
        } catch (err: any) {
            console.log('CATCH EN VIEWMODEL:', err?.message); // ← Y ESTO
            const msg = err?.response?.data?.message || err?.message || 'Error';
            setError(msg);
            throw new Error(msg);
        } finally {
            setGenerating(false);
        }
    };

    return {
        certificaciones,
        loading,
        generating,
        error,
        fetchCertificaciones,
        generar,
    };
};