import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }
  login(loginData:any){
    this.http.post<{ token: string, role: string }>(`${environment.apiBaseUrl}/logging`, loginData, { responseType: 'json' })
    .subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Save token to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        if (response.role === 'User') {
          this.router.navigate(['/home']);
        } else if (response.role === 'Admin') {
          this.router.navigate(['/admin-home']);
        } else {
          alert('Invalid role');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert("Invalid username or password");
      }
    });  
  }

  register(formData:any){
    return this.http.post(`${environment.apiBaseUrl}/insert`, formData, { responseType: 'json' }).toPromise()
      .then((response: any) => {
      console.log('Registration Successful !', response);
      return { 
        passwordMessage: response.message, 
        passwordMessageColor: response.msg_clr 
      };
      })
      .catch((error) => {
      console.error('Error submitting form:', error);
      return { 
        passwordMessage: 'Error submitting form. Please try again.', 
        passwordMessageColor: 'red' 
      };
      });
  }
  resetPassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = { oldPassword, newPassword };
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(token);
    return this.http.post(`${environment.apiBaseUrl}/api/reset-password`, payload, { headers });
  }
}
