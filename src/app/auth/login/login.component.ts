import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  year: string;
  formSubmitted = false;
  loginForm = this.fb.group({
    email: [localStorage.getItem('email') ? localStorage.getItem('email') : '', [ Validators.required, Validators.email]],
    password: [ '', [ Validators.required, Validators.minLength(6)]],
    remember: [ localStorage.getItem('email') ? true : false ],
  });

  constructor( private fb: FormBuilder, private auth: AuthService, private router: Router ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString();
  }

  signIn(): void {
    this.formSubmitted = true;

    if ( this.loginForm.invalid ) {
      return;
    }

    Swal.fire({
      title: 'Autenticando',
      text: 'Espere por favor',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.auth.signIn( this.loginForm.value)
      .subscribe( resp => {
        if ( this.loginForm.get('remember').value ) {
          localStorage.setItem('email', resp.email);
        }

        Swal.fire({
          title: 'Autenticado',
          icon: 'success'
        });
        Swal.close();

        this.router.navigateByUrl('/home');

      }, err => {
          Swal.fire({
            title: 'Error al autenticar',
            text: err.error.error.message,
            icon: 'error'
          });
        }
    );
  }

  validField( campo: string ): boolean {

    if ( this.loginForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

}
