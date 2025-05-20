import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private questions: any[] = [
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: null
    }
  ];

  constructor(private http: HttpClient) {}

  getQuestions(): any[] {
    return this.questions;
  }

  addQuestion(): void {
    this.questions.push({
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: null
    });
  }

  removeQuestion(index: number): string | null {
    if (this.questions.length <= 1) {
      return 'At least one question is required.';
    }
    this.questions.splice(index, 1);
    return null;
  }

  submitQuiz(formData: any): Observable<any> {
    // Prepare quiz data
    const quizData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
      questions: this.questions.map((q, i) => ({
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: parseInt(q.correctOptionIndex, 10)
      }))
    };

    // Validate questions
    for (const question of quizData.questions) {
      if (!question.questionText || question.options.some((opt: string) => !opt) || question.correctOptionIndex == null) {
        return throwError(() => 'Please fill in all question fields and ensure a valid correct option index.');
      }
      if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) {
        return throwError(() => 'Correct option index must be between 0 and the number of options.');
      }
    }

    // Send quiz data to API
    return this.http.post<any>(`${environment.apiBaseUrl}/api/quiz`, quizData).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(() => 'Failed to create quiz. Please try again.');
      })
    );
  }
}
