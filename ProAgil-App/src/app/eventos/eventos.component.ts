import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {defineLocale, BsLocaleService, ptBrLocale} from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  file: File;
  titulo = 'Eventos';
  nomeArquivoOriginal: string;
  dataAtual: string;
  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
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
        this.dataAtual = new Date().getMilliseconds().toString();
        this.eventoService.getAllEvento().subscribe(
          (eventos: Evento[]) => {
            this.eventos = eventos;
            this.eventosFiltrados = eventos;
          },
          error => {
            this.toastr.error(error, 'Falha ao carregar eventos');
            console.log(error);
          }
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
                this.toastr.success('Evento deletado com sucesso.');
              }, error => {
                this.toastr.error(error, 'Falha ao deletar evento');
              }
          );
        }

        editarEvento(evento: Evento, template: any) {
          this.modoSalvar = 'put';
          this.openModal(template);
          this.evento = Object.assign({}, evento);
          this.nomeArquivoOriginal = this.evento.imagemURL.toString();
          this.evento.imagemURL = '';
          this.registerForm.patchValue(this.evento);
        }

        novoEvento(template: any) {
          this.modoSalvar = 'post';
          this.openModal(template);
        }

        openModal(template: any) {
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

        uploadImagem() {
          if (this.modoSalvar === 'post') {
            const nomeArquivo = this.evento.imagemURL.split('\\', 3);
            this.evento.imagemURL = nomeArquivo[2];

            this.eventoService.postUpload(this.file, nomeArquivo[2])
              .subscribe(
                () => {
                  this.dataAtual = new Date().getMilliseconds().toString();
                  this.getEventos();
                }
              );
          } else {
            this.evento.imagemURL = this.nomeArquivoOriginal;
            this.eventoService.postUpload(this.file, this.nomeArquivoOriginal)
              .subscribe(
                () => {
                  this.dataAtual = new Date().getMilliseconds().toString();
                  this.getEventos();
                }
              );
          }
        }


        salvarAlteracao(template: any) {
          if (this.registerForm.valid) {
            if (this.modoSalvar === 'post') {
              this.evento = Object.assign({}, this.registerForm.value);

              this.uploadImagem();

              this.eventoService.postEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  template.hide();
                  this.getEventos();
                  this.toastr.success('Evento criado com sucesso.');
                }, error => {
                  this.toastr.error(error, 'Falha ao criar evento');
                }
              );
            } else {
              this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

              this.uploadImagem();

              this.eventoService.putEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  template.hide();
                  this.dataAtual = new Date().getMilliseconds().toString();
                  this.getEventos();
                  this.toastr.success('Evento editado com sucesso.');
                }, error => {
                  this.toastr.error(error, 'Falha ao editar evento');
                }
              );
            }
          }
        }

        onFileChange(event) {
          const reader = new FileReader();

          if (event.target.files && event.target.files.length) {
            this.file = event.target.files;
            console.log(this.file);
          }
        }
      }
