import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withViewTransitions()
    ), provideFirebaseApp(() =>
      initializeApp({ projectId: "trivalia-app", appId: "1:850329478297:web:b31cab04c33e858fd50408", storageBucket: "trivalia-app.firebasestorage.app", apiKey: "AIzaSyDPYecuW5c9pwil8wa7HXcedEWwjztQc8U", authDomain: "trivalia-app.firebaseapp.com", messagingSenderId: "850329478297" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient(withFetch()),

  ]
};

