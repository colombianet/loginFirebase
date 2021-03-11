import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `https://identitytoolkit.googleapis.com/v1`;
  private apiKey = 'AIzaSyAR8Gwvi0dDG-QYit9XS5o-F0B91kB9KL8';
  userToken: string;

  constructor( private http: HttpClient ) {
    this.userToken = this.getToken();
  }

  // Guarda en localStorage el token de firebase y la expiracion(calculada=1 hora despues)que se usa en el guard
  private saveTokenLocalStorage( token: string ): void {
    localStorage.setItem('token', token);

    const fechaActual = new Date();
    fechaActual.setSeconds(3600);

    const expiracion = fechaActual.getTime();
    localStorage.setItem('expiracionToken', expiracion.toString());
  }

  getToken(): string {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  // Registro de nuevo usuario
  signUp( usuario: Usuario ): Observable<any> {
    // Datos que pide firebase en su api rest auth
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${ this.url }/accounts:signUp?key=${ this.apiKey }`, authData).pipe(
      map( (resp: any) => {
        this.saveTokenLocalStorage(resp.idToken);
        return resp;
      })
    );
  }

  // Logueo
  signIn( usuario: Usuario ): Observable<any> {
    return this.http.post(`${ this.url }/accounts:signInWithPassword?key=${ this.apiKey }`, usuario).pipe(
      map( (resp: any) => {
        this.saveTokenLocalStorage(resp.idToken);
        return resp;
      })
    );
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiracionToken');
  }

  isAuthenticated(): boolean{
    if ( localStorage.getItem('token').length <= 2 ) {
      return false;
    }

    // Creo variable de tipo Date() y establezco el tiempo de caducidad guardado en LS al hacer sigIn o sigUp
    const expiracionToken = new Date();
    expiracionToken.setTime(Number(localStorage.getItem('expiracionToken')));

    // Devuelvo true o false si el tiempo de caducidad es mayor a la fecha actual para q el guard haga lo suyo
    if ( expiracionToken > new Date() ) {
      return true;
    } else {
      return false;
    }

  }
}
