import { Component } from '@angular/core';
import { AuthService } from '../services/auth-services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullname: string = '';
  username: string = '';
  phone: string = '';
  country_code: string = '';
  email: string = '';
  gender: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMessage: string = '';
  passwordMessageColor: string = '';

  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  constructor(private auth:AuthService) {}

  onPasswordInput(): void {
    if (!this.passwordRegex.test(this.password)) {
      this.passwordMessage = 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.';
      this.passwordMessageColor = 'red';
    } else {
      this.passwordMessage = 'Password meets the requirements.';
      this.passwordMessageColor = 'green';
    }
  }

  onConfirmPasswordInput(): void {
    if (this.password !== this.confirmPassword) {
      this.passwordMessage = 'Passwords do not match!';
      this.passwordMessageColor = 'red';
    } else if (this.passwordRegex.test(this.password)) {
      this.passwordMessage = 'Passwords match and meet the requirements.';
      this.passwordMessageColor = 'green';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent default form submission

    if (!this.fullname || !this.gender || !this.email || !this.phone || !this.username || !this.password || !this.confirmPassword) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!this.passwordRegex.test(this.password)) {
      this.passwordMessage = 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.';
      this.passwordMessageColor = 'red';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordMessage = 'Passwords do not match!';
      this.passwordMessageColor = 'red';
      return;
    }

    const formData = {
      fullname: this.fullname,
      gender: this.gender,
      email: this.email,
      country_code: this.country_code,
      phone: this.phone,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,

      // Add other form fields here if needed
    };

    this.auth.register(formData).then((result) => {
      this.passwordMessage = result.passwordMessage;
      this.passwordMessageColor = result.passwordMessageColor;
    });
  }
}