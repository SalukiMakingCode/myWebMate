import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Projects } from '../models/projectsModel';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  api: string = environment.api;
  private projectUpdated = new Subject<any>();

  constructor(
    private _client: HttpClient
  ) { }

  getProjectUpdateEmitter() {
    return this.projectUpdated.asObservable();
  }

  getProjectsList(): Observable<Projects> {
    return this._client.get<Projects>(this.api + "projects");
  }

  getOneProject(id: number): Observable<any> {
    return this._client.get<any>(this.api + "projects/" + id);
  }

  getProjectsByBoard(boardId: number): Observable<any> {
    return this._client.get<Projects>(this.api + "projects").pipe(map(projects => {
      return projects.result.projects.filter(project => project.boardId == boardId)
    }))
  }

  updateProject(title: string, content: string, dateBegin: Date, dateEnding: Date, id: number): Observable<any> {
    return this._client.put<any>(this.api + "projects/" + id, {
      title: title,
      description: content,
      dateBegin: dateBegin,
      dateEnding: dateEnding
    }).pipe(tap(updatedProject => {
      this.projectUpdated.next(updatedProject);
    }));
  }

  deleteProject(id: number): Observable<any> {
    return this._client.delete<any>(this.api + "projects/" + id).pipe(tap(updatedProject => {
      this.projectUpdated.next(updatedProject);
    }));
  }

  createProject(title: string, boardId?: number): Observable<any> {
    return this._client.post<any>(this.api + "projects", {
      "title": title,
      "description": "",
      "boardId": boardId
    }).pipe(tap(updatedProject => {
      this.projectUpdated.next(updatedProject);
    }));
  }
}