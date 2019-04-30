import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {defineLocale, BsLocaleService, ptBrLocale} from 'ngx-bootstrap';
defineLocale('pt-br', ptBrLocale);

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
  evento: Evento;
  modoSalvar = 'post';
  bodyDeletarEvento: string;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  bsValue = new Date().toLocaleDateString();
  FiltroLista: string;

  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }

    get filtroLista(): string {
      return this.FiltroLista;
    }

    set filtroLista(value: string) {
      this.FiltroLista = value;
      this.eventosFiltrados = this.filtroLista.length ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }

    ngOnInit() {
      this.validation();
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

        excluirEvento(evento: Evento, template: any) {
          this.openModal(template);
          this.evento = evento;
          this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
        }

        confirmeDelete(template: any) {
          this.eventoService.deleteEvento(this.evento.id).subscribe(
            () => {
                template.hide();
                this.getEventos();
              }, error => {
                console.log(error);
              }
          );
        }

        editarEvento(evento: Evento, template: any) {
          this.modoSalvar = 'put';
          this.openModal(template);
          this.evento = evento;
          this.registerForm.patchValue(this.evento);
        }

        novoEvento(template: any) {
          this.openModal(template);
        }

        openModal(template: any) {
          this.modoSalvar = 'post';
          this.registerForm.reset();
          template.show();
        }

        validation() {
          this.registerForm = this.fb.group({
            tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            local: ['', Validators.required],
            dataEvento: ['', Validators.required],
            qtdPessoas: ['', [Validators.required, Validators.min(10), Validators.max(10000)]],
            imagemURL: ['', Validators.required],
            telefone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
          });
        }

        salvarAlteracao(template: any) {
          if (this.registerForm.valid) {
            if (this.modoSalvar === 'post') {
              this.evento = Object.assign({}, this.registerForm.value);
              this.eventoService.postEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  console.log(novoEvento);
                  template.hide();
                  this.getEventos();
                }, error => {
                  console.log(error);
                }
              );
            } else {
              this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
              this.eventoService.putEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  template.hide();
                  this.getEventos();
                }, error => {
                  console.log(error);
                }
              );
            }
          }
        }
      }
