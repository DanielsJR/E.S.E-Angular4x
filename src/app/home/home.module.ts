import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CovalentFileModule } from '@covalent/core';
import { SetPassDialogRefComponent } from './user-profile/set-pass-dialog/set-pass-dialog-ref/set-pass-dialog-ref.component';
import { SetPassDialogComponent } from './user-profile/set-pass-dialog/set-pass-dialog.component';
import { HomeMenuComponent } from './menus/home-menu.component';
import { UsersMenuComponent } from './menus/users-menu.component';
import { CoursesMenuComponent } from './menus/couses-menu.component';
import { TeacherSubjectsMenuComponent } from './menus/teacher-subjects-menu.component';
import { QuizMenuComponent } from './menus/quiz-menu.component';
import { ManagerSubjectsMenuComponent } from './menus/manager-subjects-menu.component';


@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    CovalentFileModule,
    
  ],

  declarations: [
    HomeComponent,

    HomeMenuComponent,
    UsersMenuComponent,
    CoursesMenuComponent,
    ManagerSubjectsMenuComponent,
    TeacherSubjectsMenuComponent,
    QuizMenuComponent, 

    UserSettingsComponent,
    UserProfileComponent,

    SetPassDialogComponent,
    SetPassDialogRefComponent,


  ],
  
  entryComponents: [
    SetPassDialogRefComponent,
  ]


})

export class HomeModule { }
