import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../app.config';


@Component({
  selector: 'nx-teacher-subjects',
  template: `
  <nx-subjects [areaRole]="areaRole"></nx-subjects>
  `,
  styles:['']
})
export class TeacherSubjectsComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
