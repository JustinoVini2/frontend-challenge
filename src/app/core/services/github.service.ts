import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { GithubUser } from '../../models/github-user.model';
import { GithubRepo } from '../../models/github-repo.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private readonly API_URL = "https://api.github.com";

  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.API_URL}/users/${username}`);
  }

  getRepos(username: string): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(
      `${this.API_URL}/users/${username}/repos?per_page=100&sort=updated`
    );
  }

  getUserWithRepos(username: string) {
    return forkJoin({
      user: this.getUser(username),
      repos: this.getRepos(username),
    });
  }

  getRepo(owner: string, repo: string): Observable<GithubRepo> {
    return this.http.get<GithubRepo>(`${this.API_URL}/repos/${owner}/${repo}`);
  }

}
