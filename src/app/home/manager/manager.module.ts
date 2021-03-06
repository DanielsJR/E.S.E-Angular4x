import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { NgModule } from '@angular/core';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { SharedModule } from '../../shared/shared.module';
import { ManagerRoutingModule } from './manager.routing';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerComponent } from './manager.component';
import { ManagerCoursesComponent } from './manager-courses/manager-courses.component';
import { ManagerCoursesDetailComponent } from './manager-courses/manager-courses-detail/manager-courses-detail.component';
import { ManagerCoursesCreateComponent } from './manager-courses/manager-courses-create/manager-courses-create.component';

import { ManagerSubjectsDetailComponent } from './manager-subjects/manager-subject-detail/manager-subjects-detail.component';
import { ManagerSubjectsGradesComponent } from './manager-subjects/manager-subject-detail/manager-subjects-grades.component';
import { UsersModule } from '../users/users.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { ManagerSubjectCourseComponent } from './manager-subjects/manager-subject-detail/manager-subject-course.component';
import { ManagerSubjectEvaluationsComponent } from './manager-subjects/manager-subject-detail/manager-subject-evaluations.component';
import { ManagerSubjectsComponent } from './manager-subjects/manager-subjects.component';
import { QuizStudentModule } from '../quiz-student/quizStudent.module';
import { ManagerSubjectAttendanceComponent } from './manager-subjects/manager-subject-detail/manager-subject-attendance.component';
import { TeacherModule } from '../teacher/teacher.module';
import { HomeUserModule } from '../home-user/home-user.module';


@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule,
    SubjectsModule,
    UsersModule,
    QuizStudentModule,
    TeacherModule,
    HomeUserModule,
    
  ],

  declarations: [
    ManagerComponent,
    ManagerHomeComponent,

    ManagerGetTeachersComponent,
    ManagerGetStudentsComponent,

    ManagerCoursesComponent,
    ManagerCoursesDetailComponent,
    ManagerCoursesCreateComponent,

    ManagerSubjectsComponent,
        
    ManagerSubjectsDetailComponent,
    ManagerSubjectCourseComponent,
    ManagerSubjectEvaluationsComponent,
    ManagerSubjectAttendanceComponent,
    ManagerSubjectsGradesComponent,

    

  ],

  providers: [

  ],

  exports:[

  ]

})
export class ManagerModule { }
