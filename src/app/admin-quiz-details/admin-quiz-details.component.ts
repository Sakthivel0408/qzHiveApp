import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-quiz-details',
  standalone: false,
  templateUrl: './admin-quiz-details.component.html',
  styleUrl: './admin-quiz-details.component.css'
})
export class AdminQuizDetailsComponent implements OnInit {
  userQuizDetails: any[] = [];
  errorMessage: string | null = null;
  maxMarks: { [quizCode: string]: number } = {};

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.fetchUserQuizDetails();
  }

  fetchUserQuizDetails(): void {
    this.http.get(`${environment.apiBaseUrl}/api/user-quiz-details`).subscribe({
      next: (data: any) => {
        this.userQuizDetails = data;
        console.log(this.userQuizDetails);
      },
      error: (error) => {
        console.error('Error fetching user quiz details:', error);
        this.errorMessage = 'Failed to load user quiz details. Please try again later.';
      }
    });
  }

  // fetchMaxMarks(quizCode: string, quiz: any): void {
  //   this.http.get(`${environment.apiBaseUrl}/api/quiz-max-marks/${quizCode}`).subscribe({
  //     next: (data: any) => {
  //       quiz.maxMarks = data.maxMarks;
  //       console.log("here")
  //       console.log(quiz.maxMarks) // Add maxMarks directly to the quiz object
  //     },
  //     error: (error) => {
  //       console.error(`Error fetching max marks for quiz ${quizCode}:`, error);
  //     }
  //   });
  // }

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }
}