import { Component } from '@angular/core';
import { AuthService } from '../services/auth-services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private auth:AuthService) {}

  onSubmit() {
    this.auth.login(this.loginData)
  }
}

