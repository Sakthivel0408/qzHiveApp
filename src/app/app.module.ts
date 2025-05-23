import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AdminQuizDetailsComponent } from './admin-quiz-details/admin-quiz-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserHomeComponent,
    RegisterComponent,
    JoinComponent,
    QuizzesComponent,
    QuizPageComponent,
    AdminHomeComponent,
    ProfileComponent,
    LeaderboardComponent,
    CreateQuizComponent,
    ManageQuizComponent,
    ResetPasswordComponent,
    AdminQuizDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
