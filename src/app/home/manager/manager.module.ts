import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { NgModule } from '@angular/core';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { SharedModule } from '../../shared/shared.module';
import { ManagerRoutingModule } from './manager.routing';
import { GetUsersModule } from '../get-users/get-users.module';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerComponent } from './manager.component';
import { ManagerCoursesComponent } from './manager-courses/manager-courses.component';
import { ManagerSubjectsComponent } from './manager-subjects/manager-subjects.component';
import { ManagerCoursesDetailComponent } from './manager-courses/manager-courses-detail/manager-courses-detail.component';
import { ManagerCoursesCreateComponent } from './manager-courses/manager-courses-create/manager-courses-create.component';
import { ManagerSubjectsCrudDialogRefComponent } from './manager-subjects/manager-subjects-crud-dialog-ref/manager-subjects-crud-dialog-ref.component';
import { ManagerSubjectDetailComponent } from './manager-subjects/manager-subject-detail/manager-subject-detail.component';
import { ManagerSubjectGradesComponent } from './manager-subjects/manager-subject-grades/manager-subject-grades.component';



@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule,
    GetUsersModule
  ],

  declarations: [
    ManagerComponent,
    ManagerHomeComponent,
    ManagerGetTeachersComponent,
    ManagerGetStudentsComponent,
    ManagerCoursesComponent,
    ManagerSubjectsComponent,
    ManagerCoursesDetailComponent,
    ManagerCoursesCreateComponent,
    ManagerSubjectsCrudDialogRefComponent,
    ManagerSubjectDetailComponent,
    ManagerSubjectGradesComponent,
  ],

  providers: [

  ],

  entryComponents: [
    ManagerSubjectsCrudDialogRefComponent,
  ],

})
export class ManagerModule { }
