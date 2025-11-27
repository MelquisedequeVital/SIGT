export interface TCC {
  id?: number;
  studentName: string;
  studentId: string;
  advisorName: string;
  title: string;
  summary?: string;
  modality: 'presencial' | 'remoto' | 'hibrido';
  scheduledDate?: string;
  scheduledTime?: string;
  location?: string;
  committee?: string[];
  status: string;
  created_at?: string;
}
