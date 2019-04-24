import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
  // Provider para injecao de dependencia quando necessario:
  // providers: [EventoService]

})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;

  FiltroLista: string;

  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
  ) { }

  get filtroLista(): string {
    return this.FiltroLista;
  }

  set filtroLista(value: string) {
    this.FiltroLista = value;
    this.eventosFiltrados = this.filtroLista.length ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  ngOnInit() {
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (eventos: Evento[]) => {
      this.eventos = eventos;
      this.eventosFiltrados = eventos;
      console.log(eventos);
    },
    error => { console.log(error); }
      );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
