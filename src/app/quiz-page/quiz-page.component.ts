import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {
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
    this.http.get<any>(`http://localhost:5000/api/quiz/${this.quizCode}`).subscribe({
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
        console.log(question.correctOptionIndex)
        if (userAnswer === question.correctOptionIndex) {
            score++;
        }
    });

    this.score = score;
    console.log('Score:', score);
    alert(`You scored ${score} out of ${this.quiz.questions.length}`);
    }

    exitQuiz(): void {
      if (confirm('Are you sure you want to exit the quiz? Your progress will not be saved.')) {
        this.router.navigate(['/home']);
      }
    }
}