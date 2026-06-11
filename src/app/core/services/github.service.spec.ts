import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GithubRepo } from '../models/github-repo.model';
import { GithubUser } from '../models/github-user.model';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o serviço quando o TestBed inicializar', () => {
    // Arrange
    const instance = service;

    // Act
    const isCreated = Boolean(instance);

    // Assert
    expect(isCreated).toBe(true);
  });

  it('deve retornar usuário quando a API responder com sucesso', () => {
    // Arrange
    const mockUser: GithubUser = {
      login: 'justinovini',
      name: 'Vinicius',
      bio: 'Software Engineer',
      avatar_url: 'https://example.com/avatar.png',
      followers: 10,
      following: 4,
      public_repos: 20,
      location: 'Sao Paulo',
      html_url: 'https://github.com/justinovini'
    };
    let response: GithubUser | undefined;

    // Act
    service.getUser('justinovini').subscribe((user) => {
      response = user;
    });

    const request = httpMock.expectOne('https://api.github.com/users/justinovini');
    expect(request.request.method).toBe('GET');
    request.flush(mockUser);

    // Assert
    expect(response).toEqual(mockUser);
  });

  it('deve retornar erro 404 quando usuário não existir', () => {
    // Arrange
    let responseError: HttpErrorResponse | undefined;

    // Act
    service.getUser('usuario-invalido').subscribe({
      next: () => undefined,
      error: (error: HttpErrorResponse) => {
        responseError = error;
      }
    });

    const request = httpMock.expectOne('https://api.github.com/users/usuario-invalido');
    request.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

    // Assert
    expect(responseError?.status).toBe(404);
  });

  it('deve retornar repositórios quando a API responder com sucesso', () => {
    // Arrange
    const mockRepos: GithubRepo[] = [
      {
        id: 1,
        name: 'repo-a',
        full_name: 'justinovini/repo-a',
        description: 'Repositorio A',
        stargazers_count: 5,
        forks_count: 2,
        language: 'TypeScript',
        html_url: 'https://github.com/justinovini/repo-a',
        updated_at: '2026-01-01T00:00:00Z',
        topics: ['angular']
      }
    ];
    let response: GithubRepo[] | undefined;

    // Act
    service.getRepos('justinovini').subscribe((repos) => {
      response = repos;
    });

    const request = httpMock.expectOne(
      'https://api.github.com/users/justinovini/repos?per_page=100&sort=updated'
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockRepos);

    // Assert
    expect(response).toEqual(mockRepos);
  });

  it('deve retornar lista vazia quando usuário não tiver repositórios', () => {
    // Arrange
    let response: GithubRepo[] | undefined;

    // Act
    service.getRepos('justinovini').subscribe((repos) => {
      response = repos;
    });

    const request = httpMock.expectOne(
      'https://api.github.com/users/justinovini/repos?per_page=100&sort=updated'
    );
    request.flush([]);

    // Assert
    expect(response).toEqual([]);
  });

  it('deve retornar usuário e repositórios quando ambas as chamadas tiverem sucesso', () => {
    // Arrange
    const mockUser: GithubUser = {
      login: 'justinovini',
      name: 'Vinicius',
      bio: 'Software Engineer',
      avatar_url: 'https://example.com/avatar.png',
      followers: 10,
      following: 4,
      public_repos: 20,
      location: 'Sao Paulo',
      html_url: 'https://github.com/justinovini'
    };
    const mockRepos: GithubRepo[] = [
      {
        id: 2,
        name: 'repo-b',
        full_name: 'justinovini/repo-b',
        description: 'Repositorio B',
        stargazers_count: 15,
        forks_count: 3,
        language: 'TypeScript',
        html_url: 'https://github.com/justinovini/repo-b',
        updated_at: '2026-01-01T00:00:00Z',
        topics: ['frontend']
      }
    ];
    let response:
      | {
          user: GithubUser;
          repos: GithubRepo[];
        }
      | undefined;

    // Act
    service.getUserWithRepos('justinovini').subscribe((result) => {
      response = result;
    });

    const userRequest = httpMock.expectOne('https://api.github.com/users/justinovini');
    const reposRequest = httpMock.expectOne(
      'https://api.github.com/users/justinovini/repos?per_page=100&sort=updated'
    );

    userRequest.flush(mockUser);
    reposRequest.flush(mockRepos);

    // Assert
    expect(response).toEqual({ user: mockUser, repos: mockRepos });
  });

  it('deve retornar erro quando a busca de usuário com repositórios falhar', () => {
    // Arrange
    let responseError: HttpErrorResponse | undefined;

    // Act
    service.getUserWithRepos('justinovini').subscribe({
      next: () => undefined,
      error: (error: HttpErrorResponse) => {
        responseError = error;
      }
    });

    const userRequest = httpMock.expectOne('https://api.github.com/users/justinovini');
    const reposRequest = httpMock.expectOne(
      'https://api.github.com/users/justinovini/repos?per_page=100&sort=updated'
    );

    userRequest.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

    // Assert
    expect(responseError?.status).toBe(404);
    expect(reposRequest.cancelled).toBe(true);
  });

  it('deve retornar repositório quando owner e nome forem válidos', () => {
    // Arrange
    const mockRepo: GithubRepo = {
      id: 3,
      name: 'repo-c',
      full_name: 'justinovini/repo-c',
      description: 'Repositorio C',
      stargazers_count: 8,
      forks_count: 1,
      language: 'TypeScript',
      html_url: 'https://github.com/justinovini/repo-c',
      updated_at: '2026-01-01T00:00:00Z',
      topics: ['github-api']
    };
    let response: GithubRepo | undefined;

    // Act
    service.getRepo('justinovini', 'repo-c').subscribe((repo) => {
      response = repo;
    });

    const request = httpMock.expectOne('https://api.github.com/repos/justinovini/repo-c');
    expect(request.request.method).toBe('GET');
    request.flush(mockRepo);

    // Assert
    expect(response).toEqual(mockRepo);
  });

  it('deve retornar erro quando repositório não existir', () => {
    // Arrange
    let responseError: HttpErrorResponse | undefined;

    // Act
    service.getRepo('justinovini', 'repo-inexistente').subscribe({
      next: () => undefined,
      error: (error: HttpErrorResponse) => {
        responseError = error;
      }
    });

    const request = httpMock.expectOne('https://api.github.com/repos/justinovini/repo-inexistente');
    request.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

    // Assert
    expect(responseError?.status).toBe(404);
  });
});
