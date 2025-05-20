import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-join',
  standalone: false,
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  quizCode: string = '';
  isLoading: boolean = false;
  isValidCode: boolean = true; // For validation feedback
  errorMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient) {
    // Redirect to login if no token is found
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Retrieve the quiz code from localStorage
    const storedQuizCode = localStorage.getItem('quizCode');
    if (storedQuizCode) {
      this.quizCode = storedQuizCode;
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToQuizPage(): void {
    if (this.quizCode.trim() === '') {
      this.errorMessage = 'Please enter a valid quiz code.';
      return;
    }

    this.isLoading = true;

    const token: any= localStorage.getItem('token');
    if (!token)
    {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      this.isLoading = false;
      return;
    }
    const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
    const username = decodedToken.username;

    this.http.get(`${environment.apiBaseUrl}/api/user/${username}`).subscribe({
      next: (user: any) => {
          const attendedQuizzes = user.quiz_attended_and_score || [];
          const hasAttended = attendedQuizzes.some((quiz: any) => quiz.quizCode === this.quizCode);

          if (hasAttended) {
              this.errorMessage = 'You have already attended this quiz.';
              this.isLoading = false;
              return;
          }

          // Validate the quiz code by making an API call
          this.http.get(`${environment.apiBaseUrl}/api/quiz/${this.quizCode}`).subscribe({
              next: (response: any) => {
                  this.isValidCode = true;
                  this.errorMessage = null;

                  // Store the quiz code in localStorage and navigate to the quiz page
                  localStorage.setItem('quizCode', this.quizCode);
                  this.router.navigate(['/quiz-page']).finally(() => {
                      this.isLoading = false;
                  });
              },
              error: (error) => {
                  this.isValidCode = false;
                  this.errorMessage = 'Invalid quiz code. Please try again.';
                  console.error('Error validating quiz code:', error);
                  this.isLoading = false;
              }
          });
      },
      error: (error) => {
          this.errorMessage = 'Failed to fetch user data. Please try again.';
          console.error('Error fetching user data:', error);
          this.isLoading = false;
      }
    });
  }

  validateCode(): void {
    this.isValidCode = this.quizCode.trim().length > 0;
    this.http.get(`${environment.apiBaseUrl}/api/quiz/${this.quizCode}`).subscribe(
      () => this.isValidCode = true,
      () => this.isValidCode = false
    );
  }
}