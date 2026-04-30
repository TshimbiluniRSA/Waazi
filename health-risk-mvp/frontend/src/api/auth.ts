import api from './client';
import type { AuthResponse } from '../types';

export const register = (data: {
  name: string; email: string; password: string;
}): Promise<AuthResponse> =>
  api.post('/auth/register/', data).then((r) => r.data);

export const login = (data: {
  email: string; password: string;
}): Promise<AuthResponse> =>
  api.post('/auth/login/', data).then((r) => r.data);

export const guestLogin = (): Promise<AuthResponse> =>
  api.post('/auth/guest/').then((r) => r.data);
