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
    if (!this.loginData.username || !this.loginData.password) {
      alert('Please fill out all required fields.');
      return;
    }
    this.auth.login(this.loginData)
  }
}

