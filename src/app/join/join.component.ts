import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  standalone: false,
  templateUrl: './join.component.html',
  styleUrl: './join.component.css'
})

export class JoinComponent {
  path: string="image/profile_pics/";
  count: number=1;
  imageSrc: string = this.path + this.count + '.png';
  quizCode: string = ''; 
  ngOnInit(): void {
    // Retrieve the quiz code from localStorage when the component initializes
    const storedQuizCode = localStorage.getItem('quizCode');
    if (storedQuizCode) {
      this.quizCode = storedQuizCode;
    }
  }
  change(direction: number): void {
    if (direction === 1) {
      this.count--;
      if (this.count === 0) {
        this.count = 14;
      }
    } else if (direction === 2) {
      this.count++;
      if (this.count === 15) {
        this.count = 1;
      }
    }
    this.imageSrc = this.path + this.count + '.png';
  }

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToQuizPage(): void {
    if (this.quizCode.trim() === '') {
      alert('Please enter a valid quiz code.');
      return;
    }
    localStorage.setItem('quizCode', this.quizCode);
    this.router.navigate(['/quiz-page']);
  }
}
