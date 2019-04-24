import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

// {providedIn: 'root'} possibilita a injecao de dependencia em toda a aplicacao,
// sem ele deve-se sinalizar no Decorator do Component como metaDado.
@Injectable({
  providedIn: 'root'
})
export class EventoService {
baseURL = 'http://localhost:5000/api/evento';

constructor(private http: HttpClient) { }

getAllEvento(): Observable<Evento[]>  {
   return this.http.get<Evento[]>(this.baseURL);
}

getEventoByTema(id: number): Observable<Evento[]>  {
  return this.http.get<Evento[]>(`${this.baseURL}/getById/${id}`);
}

getEventoById(tema: string): Observable<Evento[]>  {
  return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
}

}
