import { Component } from '@angular/core';
import { CreateService } from '../services/create-service/create.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  standalone: false,
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  questions: any[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private createService: CreateService, private router: Router) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.questions = this.createService.getQuestions();
  }

  addQuestion(): void {
    this.createService.addQuestion();
  }

  removeQuestion(index: number): void {
    const error = this.createService.removeQuestion(index);
    if (error) {
      this.errorMessage = error;
    } else {
      this.errorMessage = null;
    }
  }

  submitQuiz(formData: any): void {
    this.errorMessage = null;
    this.loading = true;

    this.createService.submitQuiz(formData).subscribe({
      next: () => {
        this.loading = false;
        alert('Quiz created successfully!');
        this.router.navigate(['/admin-home']);
      },
      error: (error: string) => {
        this.loading = false;
        this.errorMessage = error;
      }
    });
  }
  trackByIndex(index: number): number {
    return index;
  }
}
