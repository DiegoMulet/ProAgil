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
// desenv
// baseURL = 'http://localhost:5000/api/evento';

// prod
baseURL = 'http://diegomulet.eastus.cloudapp.azure.com/ProaAgilAPI/api/evento';

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

postEvento(evento: Evento) {
  return this.http.post(this.baseURL, evento);
}

putEvento(evento: Evento) {
  return this.http.put(`${this.baseURL}/${evento.id}`, evento);
}

deleteEvento(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}

}
