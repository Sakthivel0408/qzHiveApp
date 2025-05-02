import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  submitQuiz(quizCode: string, score: number): Observable<any> {
    const payload = { quizCode, score };
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(`${this.apiUrl}/submit-quiz`, payload, { headers });
  }
  getQuizByCode(quizCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quiz/${quizCode}`);
  }

}
