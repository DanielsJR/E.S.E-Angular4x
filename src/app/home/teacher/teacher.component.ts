import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { GradeStoreService } from '../../services/grade-store.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class TeacherComponent implements OnInit, OnDestroy {

    constructor(
        private courseStoreService: CourseStoreService, private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService,
        private gradeStoreService: GradeStoreService
    ) { }

    ngOnInit(): void {
        console.log("TeacherComponent ngOnInit() called!!!");
        this.subjectStoreService.loadSubjects();
       //this.courseStoreService.loadAllCourses('2018');

        //this.userStoreService.loadAllStudents();
        
        //this.gradeStoreService.loadAllGrades();
    }

    ngOnDestroy() {
        console.log("TeacherComponent ngOnDestroy() called!!!");
    }
}