import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { LoginService } from '../../login/login.service';
import { SubjectStoreService } from '../../services/subject-store.service';

@Component({
    template: `
        <router-outlet></router-outlet>
  `
})
export class ManagerComponent implements OnInit, OnDestroy {

    constructor(
        private courseStoreService: CourseStoreService, private userStoreService: UserStoreService,
        private subjectStoreService: SubjectStoreService, private loginService: LoginService
    ) { }

    ngOnInit(): void {
          if (this.loginService.isAdmin()) {
               this.userStoreService.loadAllManagers();
           }
           this.userStoreService.loadAllTeachers();
           this.userStoreService.loadAllStudents();
   
           this.courseStoreService.loadAllCourses(2018); 
           
           this.subjectStoreService.loadAllSubjects();
    }

    ngOnDestroy() {
        console.log("ManagerComponent ngOnDestroy called!!!");
    }
}