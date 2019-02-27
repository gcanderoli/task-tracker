import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AppService } from './../appservice.service';

@Component({
  templateUrl: './appDialog.component.html',
  styleUrls: ['./appDialog.component.scss']
})
export class AppDialogComponent implements OnInit {
  title = '';
  addForm: FormGroup;
  taskData;
  states = ['Planned', 'In Progress', 'Completed'];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: AppService,
    private dialogRef: MatDialogRef<AppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.taskData = data.taskData;
    this.title = data.title;
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      estimate: ['', Validators.required],
      state: ['', Validators.required]
    });

    // if editing a task will get data from component
    if (this.taskData) {
      this.addForm.patchValue({
        id: this.taskData.id,
        name: this.taskData.name,
        description: this.taskData.description,
        estimate: this.taskData.estimate,
        state: this.taskData.state
      });
    }
  }

  // send data to service to create the task
  onSubmit() {
    this.taskService.createTask(this.addForm.value).subscribe(
      data => {
        this.dialogRef.close();
      },
      error => {
        alert(error);
      }
    );
  }

  // update a task
  onUpdate() {
    this.taskService.updateTask(this.addForm.value).subscribe(
      data => {
        this.dialogRef.close();
      },
      error => {
        alert(JSON.stringify(error));
      }
    );
  }
}
