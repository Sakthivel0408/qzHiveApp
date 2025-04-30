import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../services/profile-services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  isEditing = false;

  constructor(private profileService: ProfileService, private router: Router) {}

  profileData = {
    fullName: '',
    email: '',
    phone: '',
    username: ''
  };

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.profileData.fullName = decoded.fullName || '';
        this.profileData.email = decoded.email || '';
        this.profileData.phone = decoded.phone || '';
        this.profileData.username = decoded.username || '';
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }

  enableEditing() {
    this.isEditing = true;
  }

  confirmChanges() {
    this.isEditing = false;
    this.profileService.updateProfile(this.profileData).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        alert('Profile updated successfully!'); // Simple feedback
        localStorage.removeItem('token');
        localStorage.removeItem('quizCode');
        localStorage.removeItem('role')
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.'); // Simple feedback
      }
    });
  }
}