// src/services/googleAuth.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = 'https://auth.expo.io/@chavez_dev/VarchateApp';

export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '29593004535-l84oosto3qqri5nmfludqmvvhlvb8341.apps.googleusercontent.com',
    redirectUri: REDIRECT_URI,
  });

  // Solo log una vez cuando cambia request
  React.useEffect(() => {
    if (request) {
      console.log('✅ Google Auth configurado correctamente');
    }
  }, [request?.clientId]); // Solo cuando cambie el clientId, no en cada render

  return {
    request,
    response,
    promptAsync,
  };
};