import { Component, OnInit } from '@angular/core';
import { CourseStoreService } from '../../services/course-store.service';
import { UserStoreService } from '../../services/user-store.service';
import { SubjectStoreService } from '../../services/subject-store.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `],
})

export class ManagerComponent implements OnInit {

    constructor(
        private courseStoreService: CourseStoreService,
        private subjectStoreService: SubjectStoreService,
        private userStoreService: UserStoreService,
        private userLoggedService: UserLoggedService,

    ) { }

    ngOnInit(): void {
        if (this.userLoggedService.isAdmin()) {
            this.userStoreService.loadAllManagers();
        }
        this.userStoreService.loadAllTeachers();
        this.userStoreService.loadAllStudents();

        this.courseStoreService.loadAllCourses('2018');

        this.subjectStoreService.loadSubjects();

    }

}