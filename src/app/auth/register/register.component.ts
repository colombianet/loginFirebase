import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  year: string;
  formSubmitted = false;
  registerForm = this.fb.group({
    email: ['', [ Validators.required, Validators.email]],
    password: ['', [ Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  constructor( private fb: FormBuilder, private auth: AuthService, private router: Router ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString();
  }

  singUp(): void {
    this.formSubmitted = true;

    if ( this.registerForm.invalid ) {
      return;
    }

    Swal.fire({
      title: 'Autenticando',
      text: 'Espere por favor',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.auth.signUp( this.registerForm.value)
      .subscribe( resp => {
        if ( this.registerForm.get('remember').value ) {
          localStorage.setItem('email', resp.email);
        }

        Swal.fire({
          title: 'Autenticado',
          icon: 'success'
        });
        Swal.close();

        this.router.navigateByUrl('home');

      }, err => {
        Swal.fire({
          title: 'Error al autenticar',
          text: err.error.error.message,
          icon: 'error'
        });
      }
    );
  }

  // Valida un campo y devuelve true o false dependiendo de si tiene errores para mostrar los mismos en el html
  validField( campo: string ): boolean {

    if ( this.registerForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

}
