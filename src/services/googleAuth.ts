import { GoogleSignin, User } from '@react-native-google-signin/google-signin';

interface GoogleSignInResult {
  idToken: string;
  user: User;
}

export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  try {
    await GoogleSignin.hasPlayServices();

    const result: any = await GoogleSignin.signIn();

    // 🛡️ Type guard
    if (!('idToken' in result) || !result.idToken) {
      throw new Error('Inicio de sesión cancelado o sin token');
    }

    return {
      idToken: result.idToken,
      user: result.user,
    };
  } catch (error) {
    console.error('❌ Error en Google Sign-In:', error);
    throw error;
  }
};
