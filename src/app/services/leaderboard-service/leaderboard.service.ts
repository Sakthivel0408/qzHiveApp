import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LeaderboardEntry {
  _id: string; // Add this to match the server response
  username?: string; // Optional, as it will be mapped later
  totalScore: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  quizCodes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private apiUrl = `${environment.apiBaseUrl}/api/leaderboard`;

  constructor(private http: HttpClient) {}

  getLeaderboard(quizCode?: string): Observable<LeaderboardResponse> {
    const url = quizCode ? `${this.apiUrl}?quizCode=${quizCode}` : this.apiUrl;
    return this.http.get<LeaderboardResponse>(url).pipe(
      tap((response) => console.log('Received response from server:', response))
    );
  }
}