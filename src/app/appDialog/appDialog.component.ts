import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

import { AppService } from './../appservice.service';

@Component({
  templateUrl: "./appDialog.component.html",
  styleUrls: ["./appDialog.component.scss"]
})
export class AppDialogComponent implements OnInit {
  title = "";
  addForm: FormGroup;
  taskData;
  states = ["Planned", "In Progress", "Completed"];
  dateCreated;
  copyFormObjt; // to copy form values and add more data later
  disableSelect;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: AppService,
    private dialogRef: MatDialogRef<AppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.taskData = data.taskData;
    this.title = data.title;
    this.disableSelect = data.disableSelect;
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      description: ["", Validators.required],
      estimate: ["", Validators.required],
      state: [this.states[0], Validators.required]
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

    // filtering select options
    const index = this.states.indexOf(this.taskData.state);
    this.states = this.states.slice(index, index + 2);
  }

  // send data to service to create the task
  onSubmit() {
    this.dateCreated = moment();
    this.copyFormObjt = this.addForm.value;
    this.copyFormObjt.dateCreated = this.dateCreated;

    this.taskService.createTask(this.copyFormObjt).subscribe(
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
    const dateUpdated = moment();
    this.copyFormObjt = this.addForm.value;
    console.log("dateUpdated: " + dateUpdated);

    // calculate date diff

    if (this.addForm.value.state == "In Progress") {
      let timePlanned;
      timePlanned = this.getDiff(this.taskData.creation, dateUpdated);

      this.copyFormObjt.timePlanned = timePlanned;
      this.copyFormObjt.updating = dateUpdated;
    } else if (this.addForm.value.state == "Completed") {
      let timeInProgress;
      timeInProgress = this.getDiff(this.taskData.updating, dateUpdated);
      this.copyFormObjt.timeInProgress = timeInProgress;

      let totalTime;
      totalTime = this.getDiff(this.taskData.creation, dateUpdated);

      this.copyFormObjt.timeTotal = totalTime;
    }

    this.taskService.updateTask(this.copyFormObjt).subscribe(
      data => {
        console.log(this.addForm.value);

        this.dialogRef.close();
      },
      error => {
        alert(JSON.stringify(error));
      }
    );
  }

  // get diff between dates using moment
  getDiff(date1, date2) {
    let statusDiff;
    statusDiff = moment(date2).diff(date1, "hours", true);
    return statusDiff;
  }
}
