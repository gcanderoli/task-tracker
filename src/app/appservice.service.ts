import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:3000/tasks/';

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  });

  getTasks() {
    return this.http.get<Task[]>(this.baseUrl);
  }
  deleteTask(taskId: number) {
    return this.http.delete<Task[]>(this.baseUrl + taskId, {
      headers: this.httpHeaders
    });
  }
  createTask(task: Task) {
    return this.http.post(this.baseUrl, task, {
      headers: this.httpHeaders
    });
  }
  getTaskById(taskId: number) {
    return this.http.get<Task>(this.baseUrl + taskId, {
      headers: this.httpHeaders
    });
  }
  updateTask(task: Task) {
    return this.http.put(this.baseUrl + task.id, task, {
      headers: this.httpHeaders
    });
  }
}
