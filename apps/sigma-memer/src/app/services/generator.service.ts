import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemeToGenerate } from '@sigma-memer/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(private http: HttpClient) {}

  getMemes(searchText = ''): Observable<string[]> {
    return this.http.get<string[]>(`/api/meme?q=${searchText}`);
  }

  createMeme(params: MemeToGenerate): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`/api/meme`, params);
  }
}
