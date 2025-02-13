import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Vérifier si nous sommes dans un navigateur
  if (isPlatformBrowser(platformId)) {
    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
      return true;
    }
  }
  
  console.log("Authentification échouée - Redirection vers la page d'accueil");
  router.navigate(['/home'], { queryParams: { register: true } });
  return false;
};