import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }
  login(loginData:any){
    this.http.post<{ token: string, role: string }>('http://localhost:5000/logging', loginData, { responseType: 'json' })
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
    return this.http.post('http://localhost:5000/insert', formData, { responseType: 'json' }).toPromise()
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
}
