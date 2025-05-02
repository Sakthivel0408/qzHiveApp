import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderboardService } from '../services/leaderboard-service/leaderboard.service';

interface LeaderboardEntry {
  username: string;
  totalScore: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  quizCodes: string[] = [];
  selectedQuizCode: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private leaderboardService: LeaderboardService, private router: Router) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(quizCode?: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.leaderboardService.getLeaderboard(quizCode).subscribe({
      next: (response) => {
        console.log('Response from server:', response); // Debugging log
        // Use the username field directly from the server response
        this.leaderboard = response.leaderboard.map(entry => ({
          username: entry.username || 'Unknown', // Provide a fallback value for undefined username
          totalScore: entry.totalScore
        }));
        console.log('Mapped leaderboard:', this.leaderboard);
        this.quizCodes = response.quizCodes;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load leaderboard. Please try again.';
        console.error('Error fetching leaderboard:', error);
        this.isLoading = false;
      }
    });
  }

  onQuizCodeChange(): void {
    this.loadLeaderboard(this.selectedQuizCode || undefined);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('quizCode');
    localStorage.removeItem('role')
    this.router.navigate(['/login']);
  }

}
