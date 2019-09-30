import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { QuizStudentComponent } from "./quiz-student.component";
import { QuizStudentDetailComponent } from "./quiz-student-detail/quiz-student-detail.component";


@NgModule({
  imports: [
    SharedModule,

  ],

  declarations: [
    QuizStudentComponent,
    QuizStudentDetailComponent,

  ],

  providers: [

  ],

  entryComponents: [

  ],

  exports: [
    QuizStudentDetailComponent,

  ]

})
export class QuizStudentModule { }