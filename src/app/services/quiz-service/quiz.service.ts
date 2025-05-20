import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  // private apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  submitQuiz(quizCode: string, score: number): Observable<any> {
    const payload = { quizCode, score };
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(`${environment.apiBaseUrl}/api/submit-quiz`, payload, { headers });
  }
  getQuizByCode(quizCode: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/quiz/${quizCode}`);
  }

}
