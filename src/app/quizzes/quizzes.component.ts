import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-quizzes',
  standalone: false,
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.css'
})

export class QuizzesComponent implements OnInit {
  quizzes: any[] = []; // Array to store quizzes

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  fetchQuizzes(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/quizzes`).subscribe({
      next: (response) => {
        this.quizzes = response;
        console.log("ok")
      },
      error: (error) => {
        console.error('Error fetching quizzes:', error);
      }
    });
  }

  setCode(code: string): void {
    // Store the quiz code in localStorage or sessionStorage
    localStorage.setItem('quizCode', code);
  }
}
