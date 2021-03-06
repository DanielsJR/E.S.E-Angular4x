import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Course } from '../../../../models/course';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { CourseStoreService } from '../../../../services/course-store.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SessionStorageService } from '../../../../services/session-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../../models/user';
import { finalize } from 'rxjs/internal/operators/finalize';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { RESULT_ERROR, RESULT_ACTION1, RESULT_ACTION2, RESULT_ACTION3, RESULT_CANCELED, RESULT_DETAIL, RESULT_EDIT, RESULT_DELETE, ROLE_MANAGER, ROLE_STUDENT, ROLE_TEACHER, URI_TEACHER, URI_STUDENT, URI_MANAGER, RESULT_SUCCEED, COURSE_UPDATE_SUCCEED, COURSE_UPDATE_ERROR } from '../../../../app.config';
import { shortNameSecondName } from '../../../../shared/functions/shortName';
import { Subscription } from 'rxjs/internal/Subscription';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { CrudUserDialogComponent } from '../../../users/crud-user-dialog/crud-user-dialog.component';
import { CardUserDialogRefComponent } from '../../../users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { rowAnimation } from '../../../../shared/animations/animations';
import { SimpleDialogComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog.component';
import { MultiDatePickerService } from '../../../../shared/multi-date-picker/multy-date-picker.service';


@Component({
  selector: 'nx-manager-courses-detail',
  templateUrl: './manager-courses-detail.component.html',
  styleUrls: ['./manager-courses-detail.component.css'],
  animations: [rowAnimation]
})
export class ManagerCoursesDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  course: Course;
  chiefTeacher: User;
  listStudents: User[] = [];

  areaRole = ROLE_MANAGER;
  uriStudents = URI_STUDENT
  uriTeachers = URI_TEACHER;
  @ViewChild('crudTeacherDialog') crudTeacherDialog: CrudUserDialogComponent;
  @ViewChild('crudStudentDialog') crudStudentDialog: CrudUserDialogComponent;

  btnDisabled = true;

  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  // mat table
  displayedColumns = ['firstName', 'crud'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  rowClasses: {};
  isLoading: boolean = false;

  isSearchDisabled: boolean = true;

  courseYear: Date;

  private subscriptions = new Subscription();
  @ViewChild('duplicatedDialog') duplicatedDialog: SimpleDialogComponent;
  courseName: string;
  @ViewChild('emptyCoursesDialog') emptyCoursesDialog: SimpleDialogComponent;

  constructor(
    private route: ActivatedRoute, private router: Router, private courseStoreService: CourseStoreService,
    private multiDatePickerService: MultiDatePickerService,
    private snackbarService: SnackbarService, public dialog: MatDialog
  ) {
    this.subscriptions.add(this.multiDatePickerService.date$.subscribe(date => this.courseYear = date));
  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.filterPredicate = (user: User, filterValue: string) =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0
      || user.firstName.toLowerCase().indexOf(filterValue) === 0
      || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0;

    this.setDataSource();

  }

  setDataSource() {
    this.subscriptions.add(this.route.paramMap
      .pipe(
        switchMap(params => {
          this.courseName = params.get('name');
          return this.courseStoreService.courses$
        })
      )
      .subscribe(courses => {
        if (courses != null) {
          this.chiefTeacher = null;
          this.dataSource.data = [];

          this.course = courses.find(c => c.name.indexOf(this.courseName) === 0);
          if (this.course) {
            this.chiefTeacher = this.course.chiefTeacher;
            this.dataSource.data = this.course.students;
            this.listStudents = this.dataSource.data;
          }
          this.isSearchDisabled = (!this.dataSource.data.length) ? true : false;
          if ((!this.course) && (!this.emptyCoursesDialog.isOpen())) this.emptyCoursesDialog.openSimpleDialog();
        }
      }));

    this.subscriptions.add(this.courseStoreService.isLoadingGetCourses$.subscribe(isLoading => this.isLoading = isLoading));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  gotoCourses() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  openUserCardCrud(dialogRef: MatDialogRef<CardUserDialogRefComponent>): void {
    let user = dialogRef.componentInstance.user;
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_DETAIL) {
        (user.roles.includes(ROLE_STUDENT)) ? this.crudStudentDialog.openDialogDetail(user) : this.crudTeacherDialog.openDialogDetail();

      } else if (result === RESULT_EDIT) {
        (user.roles.includes(ROLE_STUDENT)) ? this.crudStudentDialog.openDialogEdit(user) : this.crudTeacherDialog.openDialogEdit();

      } else if (result === RESULT_DELETE) {
        (user.roles.includes(ROLE_STUDENT)) ? this.crudStudentDialog.openDialogDelete(user) : this.crudTeacherDialog.openDialogDelete();

      }
    });
  }

  addStudentToDataSource(student: User) {
    let index = this.listStudents.findIndex(s => s.id === student.id);
    if (index == -1) {
      let list = this.listStudents.slice();
      list.push(student);

      this.listStudents = list;
      this.dataSource.data = this.listStudents;

      this.btnDisabled = false;
    } else {
      this.duplicatedDialog.openSimpleDialog(student, student.avatar);
    }

  }

  private deleteStudentFromDataSource(id: string) {
    this.listStudents = this.listStudents.filter(s => s.id !== (id));
    this.dataSource.data = this.listStudents;
    this.btnDisabled = false;
  }

  deleteStudent(dialogRef: MatDialogRef<SimpleDialogRefComponent>): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);

      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.deleteStudentFromDataSource(dialogRef.componentInstance.obj.id);

      } else if (result === RESULT_ACTION2) {
        console.log(RESULT_ACTION2);

      } else if (result === RESULT_ACTION3) {
        console.log(RESULT_ACTION3);
      }
    });
  }

  changeTeacher(teacher: User) {
    this.chiefTeacher = teacher;
    this.btnDisabled = false;
  }

  saveCourse() {
    let courseEdit: Course = Object.assign({}, this.course);
    courseEdit.chiefTeacher = this.chiefTeacher;
    courseEdit.students = this.listStudents;

    this.subscriptions.add(this.courseStoreService.update(courseEdit)
      .pipe(finalize(() => this.btnDisabled = true))
      .subscribe(_ => {
        this.snackbarService.openSnackBar(COURSE_UPDATE_SUCCEED, RESULT_SUCCEED);
        this.gotoCourses();
      },
        err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : COURSE_UPDATE_ERROR, RESULT_ERROR)
      ));

  }




}
