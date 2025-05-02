import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
  };

  passwordMessage: string = '';
  passwordMessageColor: string = '';
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  constructor(private router: Router , private authService: AuthService) {}

  onPasswordInput(): void {
      if (!this.passwordRegex.test(this.resetData.newPassword)) {
          this.passwordMessage = 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.';
          this.passwordMessageColor = 'red';
      } else {
          this.passwordMessage = 'Password meets the requirements.';
          this.passwordMessageColor = 'green';
      }
      // Re-check confirm password if already entered
      if (this.resetData.confirmPassword) {
          this.onConfirmPasswordInput();
      }
  }

  onConfirmPasswordInput(): void {
      if (this.resetData.newPassword !== this.resetData.confirmPassword) {
          this.passwordMessage = 'Passwords do not match!';
          this.passwordMessageColor = 'red';
      } else if (this.passwordRegex.test(this.resetData.newPassword)) {
          this.passwordMessage = 'Passwords match and meet the requirements.';
          this.passwordMessageColor = 'green';
      }
  }

  isPasswordValid(): boolean {
      return this.passwordRegex.test(this.resetData.newPassword) && 
             this.resetData.newPassword === this.resetData.confirmPassword;
  }

  onSubmit(): void {
    // Validate old password
    if (!this.resetData.oldPassword) {
        this.passwordMessage = 'Old password is required.';
        this.passwordMessageColor = 'red';
        return;
    }

    // Validate new password format
    if (!this.passwordRegex.test(this.resetData.newPassword)) {
        this.passwordMessage = 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.';
        this.passwordMessageColor = 'red';
        return;
    }

    // Validate password confirmation
    if (this.resetData.newPassword !== this.resetData.confirmPassword) {
        this.passwordMessage = 'Passwords do not match!';
        this.passwordMessageColor = 'red';
        return;
    }

    // Call the resetPassword service
    this.authService.resetPassword(this.resetData.oldPassword, this.resetData.newPassword).subscribe({
        next: (response) => {
            this.passwordMessage = 'Password reset successfully!';
            this.passwordMessageColor = 'green';
            this.router.navigate(['/profile']);
        },
        error: (error) => {
            console.error('Error resetting password:', error); // Debugging log
            this.passwordMessage = error.error?.message || 'An error occurred while resetting the password.';
            this.passwordMessageColor = 'red';
        }
    });
  }
}