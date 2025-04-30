import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { RegisterComponent } from './register/register.component';
import { JoinComponent } from './join/join.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { ManageQuizComponent } from './manage-quiz/manage-quiz.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: UserHomeComponent},
  {path: 'admin-home', component: AdminHomeComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'join', component: JoinComponent},
  { path: 'quizzes', component: QuizzesComponent},
  { path: 'reset-pass', component: ResetPassComponent},
  { path: 'quiz-page', component: QuizPageComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: 'create-quiz', component: CreateQuizComponent},
  { path: 'manage-quizzes', component: ManageQuizComponent},
  // Add other routes like register, home, etc.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
