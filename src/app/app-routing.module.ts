import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminsComponent } from './admins/admins.component';
import { ArticleComponent } from './article/article.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SurveyQuestionComponent } from './survey-question/survey-question.component';
import { AuthGuard } from './shared/auth.guard';

import { MediaComponent } from './media/media.component';

const routes: Routes = [
  // {path:'Bloom/admin/dashboard', component: HomeComponent, canActivate:[AuthGuard]},
  // {path:'Bloom/admin/login', component: LoginComponent},
  // {path:'Bloom/admins', component: AdminsComponent, canActivate:[AuthGuard]},
  // {path:'Bloom/admin/surveyquestions', component: SurveyQuestionComponent, canActivate:[AuthGuard]},
  // {path:'Bloom/admin/article', component: ArticleComponent, canActivate:[AuthGuard]},
  // { path: '', redirectTo: 'Bloom/admin/login', pathMatch: 'full' }

  {path:'Bloom/admin/dashboard', component: HomeComponent},
  {path:'Bloom/admin/login', component: LoginComponent},
  {path:'Bloom/admins', component: AdminsComponent},
  {path:'Bloom/admin/surveyquestions', component: SurveyQuestionComponent},
  {path:'Bloom/admin/article', component: ArticleComponent},
  { path: '', redirectTo: 'Bloom/admin/login', pathMatch: 'full' },

  {path:'Bloom/admin/media', component: MediaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
