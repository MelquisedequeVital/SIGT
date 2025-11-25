import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TccService {
  private endpoint = 'https://twzzctfrpfgaeekyzimk.supabase.co/rest/v1/tccs';

  private apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzanZnd3RuemNxeWRycWJncXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTYwMDcsImV4cCI6MjA3OTY3MjAwN30.77q8_OfEm1o-KRKTYZyx0StvIkeLM1FKbbF4eQ6qRC4';

  private httpOptions = {
    headers: new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint, this.httpOptions);
  }

  createTask(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint, data, this.httpOptions);
  }

  updateTask(id: number, data: any): Observable<any> {
    return this.http.patch<any>(
      `${this.endpoint}?id=eq.${id}`,
      data,
      this.httpOptions
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.endpoint}?id=eq.${id}`,
      this.httpOptions
    );
  }
}
