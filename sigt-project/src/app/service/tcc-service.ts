import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TCC } from '../model/tcc-model';

@Injectable({
  providedIn: 'root'
})
export class TccService {

  // 1. Altere esta linha para o endereço do seu Java
  private apiUrl = 'http://localhost:8080/api/tccs';

  // 2. Você pode apagar a linha da apiKey e do supabaseUrl antigos
  
  // 3. Simplifique os headers (o Java geralmente não precisa de apikey)
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getTccs(): Observable<TCC[]> {
    // Agora o link é limpo: http://localhost:8080/api/tccs
    return this.http.get<TCC[]>(this.apiUrl, { headers: this.headers });
  }

  createTcc(data: TCC): Observable<any> {
    // Envia o TCC para o @PostMapping do seu TccController
    return this.http.post(this.apiUrl, data, { headers: this.headers });
  }

  updateTcc(id: number, data: Partial<TCC>): Observable<any> {
    // No Java, caminhos com ID geralmente são: api/tccs/1
    return this.http.patch(`${this.apiUrl}/${id}`, data, { headers: this.headers });
  }

  deleteTcc(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
