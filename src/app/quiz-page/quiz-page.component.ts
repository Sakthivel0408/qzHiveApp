import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { QuizService } from '../services/quiz-service/quiz.service';

@Component({
  selector: 'app-quiz-page',
  standalone: false,
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.css'
})
export class QuizPageComponent implements OnInit {
  quizCode: string | null = null;
  quiz: any = null;
  errorMessage: string | null = null;
  score: number | null = null;

  constructor(private http: HttpClient, private router: Router, private quizService: QuizService) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Retrieve the quiz code from localStorage
    this.quizCode = localStorage.getItem('quizCode');

    if (!this.quizCode) {
      this.errorMessage = 'No quiz code found. Please enter a valid quiz code.';
      return;
    }

    // Fetch the quiz data from the API
    this.quizService.getQuizByCode(this.quizCode).subscribe({
      next: (quiz) => {
        console.log('Quiz fetched successfully:', quiz);
        if (!quiz.questions || quiz.questions.length === 0) {
          this.errorMessage = 'No questions available.';
          return;
        }
        this.quiz = quiz;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load quiz.';
        console.error('Error:', error);
      }
    });
  }

  submitQuiz(formData: any): void {
    console.log('Form Data:', formData);
    if (!this.quiz || !this.quiz.questions) {
        return;
    }

    let score = 0;

    this.quiz.questions.forEach((question: any, index: number) => {
        const userAnswer = parseInt(formData[`question${index}`], 10);
        if (userAnswer === question.correctOptionIndex) {
            score++;
        }
    });

    this.score = score;
    console.log('Score:', score);

    this.quizService.submitQuiz(this.quiz.code, this.score).subscribe({
        next: (response) => {
            console.log('Quiz submission successful:', response);
            alert(`You scored ${score} out of ${this.quiz.questions.length}`);
        },
        error: (error) => {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        }
    });
  }

  exitQuiz(): void {
    if (confirm('Are you sure you want to exit the quiz? Your progress will not be saved.')) {
      this.router.navigate(['/home']);
    }
  }
}