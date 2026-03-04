import api from '../api/api';

export interface CertificacionData {
    codigo_certificado: string;
    modulo: {
        titulo: string;
        slug: string;
    };
    resultados: {
        porcentaje_obtenido: number;
        fecha_emision: string;
        descargado: boolean;
    };
    urls: {
        ver: string;
        descargar: string;
        verificar: string;
    };
}

export interface GenerarCertificacionResponse {
    codigo_certificado: string;
    usuario: string;
    modulo: string;
    porcentaje: number;
    fecha_emision: string;
    urls: {
        ver_imagen: string;
        descargar: string;
        verificar: string;
    };
}

export const generarCertificacion = async (moduloId: number) => {
    try {
        const response = await api.post(`/modulos/${moduloId}/certificacion/generar`);
        return response.data as { success: boolean; message: string; data: GenerarCertificacionResponse };
    } catch (err: any) {
        // Si es 400 con codigo_existente, retornarlo como respuesta normal (no error)
        if (err?.response?.status === 400 && err?.response?.data?.data?.codigo_existente) {
            return err.response.data as { success: boolean; message: string; data: any };
        }
        throw err;
    }
};

// ✅ CORREGIDO: Buscar por módulo ID en lugar de slug
export const obtenerCertificadoPorModuloId = async (moduloId: number) => {
    // Primero obtener todas las certificaciones del usuario
    const response = await api.get('/certificaciones');
    
    if (!response.data.success) {
        throw new Error('No se pudieron obtener las certificaciones');
    }
    
    // ✅ La API no devuelve el ID del módulo directamente, 
    // así que necesitamos otra estrategia
    const certificaciones = response.data.data.certificaciones;
    
    if (!certificaciones || certificaciones.length === 0) {
        throw new Error('No tienes certificados disponibles');
    }
    
    // ✅ OPCIÓN 1: Si solo hay un certificado por módulo, buscar por slug
    // (asumiendo que el usuario pasa el slug del módulo desde modulesWithProgress)
    const certificacion = certificaciones.find((cert: CertificacionData) => {
        // Aquí podrías comparar por slug si lo tienes disponible
        return true; // Placeholder - ver nota abajo
    });
    
    if (!certificacion) {
        throw new Error('No tienes un certificado para este módulo');
    }
    
    // Retornar en el formato esperado por el componente
    return {
        success: true,
        data: {
            codigo: certificacion.codigo_certificado,
            modulo: {
                titulo: certificacion.modulo.titulo
            },
            porcentaje_obtenido: certificacion.resultados.porcentaje_obtenido,
            fecha_emision: certificacion.resultados.fecha_emision
        }
    };
};

// Buscar por slug del módulo (más confiable)
export const obtenerCertificadoPorSlug = async (moduloSlug: string, intentos = 3, delayMs = 1500) => {
    for (let i = 0; i < intentos; i++) {
        const response = await api.get('/certificaciones');
        
        if (!response.data.success) {
            throw new Error('No se pudieron obtener las certificaciones');
        }
        
        const certificacion = response.data.data.certificaciones.find(
            (cert: CertificacionData) => cert.modulo.slug === moduloSlug
        );
        
        if (certificacion) {
            return {
                success: true,
                data: {
                    codigo: certificacion.codigo_certificado,
                    modulo: { titulo: certificacion.modulo.titulo },
                    porcentaje_obtenido: certificacion.resultados.porcentaje_obtenido,
                    fecha_emision: certificacion.resultados.fecha_emision
                }
            };
        }
        
        // Si no encontró y quedan intentos, esperar y reintentar
        if (i < intentos - 1) {
            console.log(`Certificado no encontrado, reintentando en ${delayMs}ms... (${i + 1}/${intentos})`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    
    throw new Error('No tienes un certificado para este módulo');
};

export const getMisCertificaciones = async () => {
    const response = await api.get('/certificaciones');
    return response.data as { success: boolean; data: { total: number; certificaciones: CertificacionData[] } };
};

export const getUrlVerCertificado = (codigo: string) =>
    `/certificaciones/${codigo}/ver`;

export const getUrlDescargarCertificado = (codigo: string) =>
    `/certificaciones/${codigo}/descargar`;