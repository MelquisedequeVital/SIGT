import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TCC } from '../model/tcc-model';

@Injectable({
  providedIn: 'root'
})
export class TccService {

  private supabaseUrl = 'https://twzzctfrpfgaeekyzimk.supabase.co/rest/v1';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3enpjdGZycGZnYWVla3l6aW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQwNzYsImV4cCI6MjA3ODY1MDA3Nn0.CQvEjwaqDLGJFq1Jrng3Lfr2nLPAdQtq8YeorRszyfQ';

  private headers = new HttpHeaders({
    apikey: this.apiKey,
    Authorization: `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getTccs(): Observable<TCC[]> {
    return this.http.get<TCC[]>(`${this.supabaseUrl}/tccs?select=*`, {
      headers: this.headers
    });
  }

  createTcc(data: TCC): Observable<any> {
    return this.http.post(`${this.supabaseUrl}/tccs`, data, {
      headers: this.headers
    });
  }

  updateTcc(id: number, data: Partial<TCC>): Observable<any> {
    return this.http.patch(`${this.supabaseUrl}/tccs?id=eq.${id}`, data, {
      headers: this.headers
    });
  }

  deleteTcc(id: number): Observable<any> {
    return this.http.delete(`${this.supabaseUrl}/tccs?id=eq.${id}`, {
      headers: this.headers
    });
  }
}
