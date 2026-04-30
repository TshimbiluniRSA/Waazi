import { create } from 'zustand';
import type { User, AssessmentPayload, AssessmentResult } from '../types';

interface AssessmentStore {
  // Auth
  user: User | null;
  accessToken: string | null;

  // Multi-step form state
  formData: Partial<AssessmentPayload>;
  currentStep: number;
  consentGiven: boolean;

  // Result
  result: AssessmentResult | null;

  // Actions
  setAuth: (user: User, access: string, refresh: string) => void;
  updateForm: (data: Partial<AssessmentPayload>) => void;
  setStep: (step: number) => void;
  setConsent: (value: boolean) => void;
  setResult: (result: AssessmentResult) => void;
  logout: () => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  formData: {},
  currentStep: 0,
  consentGiven: false,
  result: null,

  setAuth: (user, access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ user, accessToken: access });
  },

  updateForm: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  setStep: (step) => set({ currentStep: step }),

  setConsent: (value) => set({ consentGiven: value }),

  setResult: (result) => set({ result }),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null, formData: {}, result: null, currentStep: 0 });
  },
}));
