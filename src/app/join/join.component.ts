import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

    // Validate the quiz code by making an API call
    this.http.get(`http://localhost:5000/api/quiz/${this.quizCode}`).subscribe({
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
  }

  // Optional: Real-time validation method (if you want to validate as the user types)
  validateCode(): void {
    this.isValidCode = this.quizCode.trim().length > 0; // Placeholder logic
    // For real validation, you might call a service:
    this.http.get(`http://localhost:5000/api/quiz/${this.quizCode}`).subscribe(
      () => this.isValidCode = true,
      () => this.isValidCode = false
    );
  }
}