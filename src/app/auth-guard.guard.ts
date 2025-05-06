import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || !userRole) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.navigate(['/login']);
    return false;
  }

  if (!['User', 'Admin'].includes(userRole)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];
  if (!requiredRole || userRole === requiredRole) {
    return true;
  }

  router.navigate([userRole === 'Admin' ? '/admin-home' : '/user-home']);
  return false;
};