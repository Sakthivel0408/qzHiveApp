import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageQuizService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quizzes`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching quizzes:', error);
        return throwError(() => 'Failed to fetch quizzes. Please try again.');
      })
    );
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-quiz/${id}`).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error('Error deleting quiz:', error);
        return throwError(() => 'Failed to delete quiz. Please try again.');
      })
    );
  }

  updateQuiz(id: string, quizData: any): Observable<any> {
    // Validate questions
    for (const question of quizData.questions) {
      if (!question.questionText || question.options.some((opt: string) => !opt) || question.correctOptionIndex == null) {
        return throwError(() => 'Please fill in all question fields and ensure a valid correct option index.');
      }
      if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) {
        return throwError(() => 'Correct option index must be between 0 and the number of options.');
      }
      if (question.options.length < 2 || question.options.length > 6) {
        return throwError(() => 'Each question must have between 2 and 6 options.');
      }
    }

    return this.http.put<any>(`${this.apiUrl}/update-quiz/${id}`, quizData).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error updating quiz:', error);
        return throwError(() => 'Failed to update quiz. Please try again.');
      })
    );
  }
}