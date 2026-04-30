import api from './client';
import type { AssessmentPayload, AssessmentResult } from '../types';

export const submitAssessment = (
  payload: AssessmentPayload
): Promise<AssessmentResult> =>
  api.post('/assessments/submit/', payload).then((r) => r.data);

export const downloadReport = (assessmentId: string): Promise<Blob> =>
  api
    .get(`/reports/${assessmentId}/pdf/`, { responseType: 'blob' })
    .then((r) => r.data);
