// src/services/googleAuth.ts
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '29593004535-l84oosto3qqri5nmfludqmvvhlvb8341.apps.googleusercontent.com',
  offlineAccess: false,
});

interface GoogleSignInResult {
  idToken: string;
  user: User;
}

export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  try {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();
    
    console.log('✅ Google Sign-In exitoso');
    console.log('Usuario:', data?.user);
    
    if (!data?.idToken) {
      throw new Error('No se recibió el idToken de Google');
    }
    
    console.log('Token para Laravel:', data.idToken);
    
    return {
      idToken: data.idToken,
      user: data.user
    };
  } catch (error: any) {
    console.error('❌ Error en Google Sign-In:', error);
    throw error;
  }
};