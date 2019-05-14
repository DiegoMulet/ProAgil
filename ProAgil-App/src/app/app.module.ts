import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TooltipModule, ModalModule, TabsModule, BsDatepickerModule  } from 'ngx-bootstrap';
import {NgxMaskModule} from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { EventoService } from './_services/evento.service';

import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoEditComponent } from './eventos/eventoEdit/eventoEdit.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { NavComponent } from './nav/nav.component';
import { TituloComponent } from './_shared/titulo/titulo.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';

import { DateTimeFormatPipePipe } from './_helps/DateTimeFormatPipe.pipe';
import { AuthService } from './_services/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
   declarations: [
      AppComponent,
      EventosComponent,
      EventoEditComponent,
      NavComponent,
      PalestrantesComponent,
      DashboardComponent,
      ContatosComponent,
      TituloComponent,
      UserComponent,
      LoginComponent,
      RegistrationComponent,
      DateTimeFormatPipePipe
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TooltipModule.forRoot(),
      ModalModule.forRoot(),
      ReactiveFormsModule,
      BrowserAnimationsModule,
      TabsModule.forRoot(),
      ToastrModule.forRoot({
         timeOut: 10000,
         positionClass: 'toast-bottom-right',
         preventDuplicates: true,
       }),
       NgxMaskModule.forRoot(),
       NgxCurrencyModule
   ],
   // possibilita a injecao de dependencia em toda a aplicacao
   providers: [
      EventoService,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
