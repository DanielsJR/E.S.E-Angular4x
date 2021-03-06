import { Course } from "../models/course";
import { CourseBackendService } from "./course-backend.service";
import { User } from "../models/user";
import { IsLoadingService } from "./isLoadingService.service";
import { SubjectStoreService } from "./subject-store.service";

import { tap } from "rxjs/internal/operators/tap";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class CourseStoreService {

    private dataStore: { courses: Course[] };
    private coursesSource = <BehaviorSubject<Course[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);


    constructor(
        private isLoadingService: IsLoadingService,
        private courseBackendService: CourseBackendService,
        private subjectStoreService: SubjectStoreService,

    ) {
        this.dataStore = { courses: [] };
    }

    get courses$() {
        return this.coursesSource.asObservable();
    }

    get isLoadingGetCourses$() {
        return this.isLoadingGet.asObservable();
    }

    loadCoursesByYear(year: string) {
        console.log(`********GET-Courses-FROM-BACKEND********`);
        this.isLoadingGet.next(true);
        this.courseBackendService.getCourses(year)
            .pipe(finalize(() => this.isLoadingGet.next(false)))
            .subscribe(data => {
                this.dataStore.courses = data;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                if (data.length == 0) console.error('course list empty');
            });
    }

    loadOneCourse(name: string): Observable<Course> {
        return this.courses$
            .pipe(map(courses => courses?.find(course => course?.name === name)));
    }

    create(course: Course): Observable<Course> {
        this.isLoadingService.isLoadingEmit(true);
        return this.courseBackendService.create(course)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingEmit(false)),
                tap(data => {
                    this.dataStore.courses.push(data);
                    this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                }));
    }

    update(course: Course): Observable<Course> {
        this.isLoadingService.isLoadingEmit(true);
        return this.courseBackendService.update(course)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingEmit(false)),
                tap(data => {
                    let index = this.dataStore.courses.findIndex(c => c.id === data.id);
                    if (index != -1) {
                        this.dataStore.courses[index] = data;
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                        this.subjectStoreService.updateCourseInSubjectStore(data);
                    }
                }));
    }

    delete(course: Course): Observable<Course> {
        this.isLoadingService.isLoadingEmit(true);
        return this.courseBackendService.delete(course)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingEmit(false)),
                tap(_ => {
                    let index = this.dataStore.courses.findIndex((c: Course) => c.id === course.id);
                    if (index != -1) {
                        this.dataStore.courses.splice(index, 1);
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                    }
                }));
    }


    clearStore() {
        console.log("****************Clearing CourseStore with null******************");
        this.dataStore.courses = null;
        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
    }



    //************userStore CHIEF_TEACHER

    //one to one
    updateChiefTeacherInCourseStoreOneToOne(teacher: User) {
        let curso = this.dataStore.courses.find(c => c.chiefTeacher.id === teacher.id);
        if (curso) {
            curso.chiefTeacher = teacher;
            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            this.dataStore.courses[index] = curso;
            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
        }
    }

    //one to many
    updateChiefTeacherInCourseStoreOneToMany(teacher: User) {
        if (this.dataStore.courses.find(c => c.chiefTeacher.id === teacher.id)) {
            this.dataStore.courses.forEach((c, index) => {
                if (c.chiefTeacher.id === teacher.id) {
                    c.chiefTeacher = teacher;
                    this.dataStore.courses[index] = c;
                }
            });
            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
        }
    }


    //************userStore STUDENTS

    //one to one **********************
    updateStudentInCourseStoreOneToOne(student: User) {
        let curso = this.dataStore.courses.find(c => c.students.map(s => s.id).indexOf(student.id) !== -1);
        if (curso) {
            let indexS = curso.students.findIndex(s => s.id === student.id);
            curso.students[indexS] = student;

            let indexC = this.dataStore.courses.findIndex(c => c.id === curso.id);
            this.dataStore.courses[indexC] = curso;
            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            this.subjectStoreService.updateCourseInSubjectStore(curso);
        }

    }

    deleteStudentInCourseStoreOneToOne(student: User | string) {
        let curso = this.dataStore.courses.find(c => c.students.map(s => s.id).indexOf((typeof student === 'string') ? student : student.id) !== -1);
        if (curso) {
            let indexS = curso.students.findIndex((s) => s.id === ((typeof student === 'string') ? student : student.id));
            curso.students.splice(indexS, 1);

            let indexC = this.dataStore.courses.findIndex(c => c.id === curso.id);
            this.dataStore.courses[indexC] = curso;
            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            this.subjectStoreService.updateCourseInSubjectStore(curso);
        }
    }


    //one to many*******************
    updateStudentInCourseStoreOneToMany(student: User) {
        if (this.dataStore.courses.find(c => c.students.map(s => s.id).indexOf(student.id) !== -1)) {
            this.dataStore.courses.forEach((c, index) => {
                if (c.students.map(s => s.id).indexOf(student.id) !== -1) {
                    let indexS = c.students.findIndex((s) => s.id === student.id);
                    c.students[indexS] = student;
                    this.dataStore.courses[index] = c;
                    this.subjectStoreService.updateCourseInSubjectStore(c);
                }
            });

            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
        }
    }

    deleteStudentInCourseStoreOneToMany(student: User | string) {
        if (this.dataStore.courses.find(c => c.students.map(s => s.id).indexOf((typeof student === 'string') ? student : student.id) !== -1)) {
            this.dataStore.courses.forEach((c, index) => {
                if (c.students.map(s => s.id).indexOf((typeof student === 'string') ? student : student.id) !== -1) {
                    let indexS = c.students.findIndex((s) => s.id === ((typeof student === 'string') ? student : student.id));
                    c.students.splice(indexS, 1);
                    this.dataStore.courses[index] = c;
                    this.subjectStoreService.updateCourseInSubjectStore(c);
                }
            });

            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
        }
    }





}