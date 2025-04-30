import { Component, OnInit } from '@angular/core';
import { ManageQuizService } from '../services/manage-quiz-service/manage-quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-quiz',
  standalone: false,
  templateUrl: './manage-quiz.component.html',
  styleUrl: './manage-quiz.component.css'
})
export class ManageQuizComponent implements OnInit {
  quizzes: any[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;
  isEditing: boolean = false;
  selectedQuiz: any = null;
  tagsInput: string = '';
  showPreview: boolean = false;
  expandedQuestions: boolean[] = [];

  constructor(private manageQuizService: ManageQuizService, private router: Router) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.loading = true;
    this.errorMessage = null;
    this.manageQuizService.getQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.loading = false;
      },
      error: (error: string) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  editQuiz(quiz: any): void {
    this.selectedQuiz = { ...quiz, questions: quiz.questions.map((q: any) => ({ ...q, options: [...q.options] })) };
    this.tagsInput = quiz.tags.join(', ');
    this.expandedQuestions = new Array(quiz.questions.length).fill(true);
    this.isEditing = true;
    this.showPreview = false;
  }

  toggleQuestion(index: number): void {
    this.expandedQuestions[index] = !this.expandedQuestions[index];
  }

  addQuestion(): void {
    this.selectedQuiz.questions.push({
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: null
    });
    this.expandedQuestions.push(true);
  }

  removeQuestion(index: number): void {
    if (this.selectedQuiz.questions.length <= 1) {
      this.errorMessage = 'At least one question is required.';
      return;
    }
    this.selectedQuiz.questions.splice(index, 1);
    this.expandedQuestions.splice(index, 1);
    this.errorMessage = null;
  }

  addOption(questionIndex: number): void {
    if (this.selectedQuiz.questions[questionIndex].options.length >= 6) {
      this.errorMessage = 'Maximum 6 options allowed per question.';
      return;
    }
    this.selectedQuiz.questions[questionIndex].options.push('');
    this.errorMessage = null;
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    if (this.selectedQuiz.questions[questionIndex].options.length <= 2) {
      this.errorMessage = 'At least 2 options are required per question.';
      return;
    }
    this.selectedQuiz.questions[questionIndex].options.splice(optionIndex, 1);
    if (this.selectedQuiz.questions[questionIndex].correctOptionIndex >= this.selectedQuiz.questions[questionIndex].options.length) {
      this.selectedQuiz.questions[questionIndex].correctOptionIndex = this.selectedQuiz.questions[questionIndex].options.length - 1;
    }
    this.errorMessage = null;
  }

  updateQuiz(formData: any): void {
    this.errorMessage = null;
    this.loading = true;

    const quizData = {
      ...formData,
      tags: this.tagsInput ? this.tagsInput.split(',').map((tag: string) => tag.trim()) : [],
      questions: this.selectedQuiz.questions
    };

    this.manageQuizService.updateQuiz(this.selectedQuiz._id, quizData).subscribe({
      next: () => {
        this.loading = false;
        this.isEditing = false;
        this.selectedQuiz = null;
        this.tagsInput = '';
        this.showPreview = false;
        alert('Quiz updated successfully!');
        this.loadQuizzes();
      },
      error: (error: string) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedQuiz = null;
    this.tagsInput = '';
    this.showPreview = false;
    this.errorMessage = null;
  }

  deleteQuiz(id: string): void {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.manageQuizService.deleteQuiz(id).subscribe({
      next: () => {
        this.loading = false;
        alert('Quiz deleted successfully!');
        this.loadQuizzes();
      },
      error: (error: string) => {
        console.log(id);
        this.errorMessage = error;
        this.loading = false;
      }
    });
  }

  trackById(index: number, quiz: any): string {
    return quiz._id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}