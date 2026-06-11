import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { GithubRepo } from '../models/github-repo.model';
import { GithubUser } from '../models/github-user.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private readonly http: HttpClient) {}

  getUser(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.baseUrl}/users/${username}`);
  }

  getRepos(username: string): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(
      `${this.baseUrl}/users/${username}/repos?per_page=100&sort=updated`
    );
  }

  getUserWithRepos(username: string) {
    return forkJoin({
      user: this.getUser(username),
      repos: this.getRepos(username)
    });
  }

  getRepo(owner: string, repo: string): Observable<GithubRepo> {
    return this.http.get<GithubRepo>(`${this.baseUrl}/repos/${owner}/${repo}`);
  }
}
