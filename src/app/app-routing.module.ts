import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { RegisterComponent } from './register/register.component';
import { JoinComponent } from './join/join.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { ManageQuizComponent } from './manage-quiz/manage-quiz.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { authGuardGuard } from './auth-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: UserHomeComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  {path: 'admin-home', component: AdminHomeComponent, canActivate: [authGuardGuard], data: { role: 'Admin' }},
  { path: 'register', component: RegisterComponent},
  { path: 'join', component: JoinComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  { path: 'quizzes', component: QuizzesComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'quiz-page', component: QuizPageComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  { path: 'profile', component: ProfileComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  { path: 'create-quiz', component: CreateQuizComponent, canActivate: [authGuardGuard], data: { role: 'Admin' }},
  { path: 'manage-quizzes', component: ManageQuizComponent, canActivate: [authGuardGuard], data: { role: 'Admin' }},
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [authGuardGuard], data: { role: 'User' }},
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
