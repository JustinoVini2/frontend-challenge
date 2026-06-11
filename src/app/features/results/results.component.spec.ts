import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ResultsComponent } from './results.component';
import { GithubService } from '../../core/services/github.service';
import { RepoCardComponent } from '../../shared/components/repo-card/repo-card.component';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let githubService: GithubService;

  const mockUser = {
    login: 'justinovini',
    name: 'Vinicius',
    bio: 'Software Engineer',
    avatar_url: 'https://example.com/avatar.png',
    followers: 5,
    following: 3,
    public_repos: 10,
    location: 'Sao Paulo',
    html_url: 'https://github.com/justinovini'
  };

  const mockRepos = [
    {
      id: 1,
      name: 'repo-a',
      full_name: 'justinovini/repo-a',
      description: 'Repositorio A',
      stargazers_count: 10,
      forks_count: 2,
      language: 'TypeScript',
      html_url: 'https://github.com/justinovini/repo-a',
      updated_at: '2026-01-01T00:00:00Z',
      topics: ['angular']
    },
    {
      id: 2,
      name: 'repo-b',
      full_name: 'justinovini/repo-b',
      description: 'Repositorio B',
      stargazers_count: 5,
      forks_count: 1,
      language: 'JavaScript',
      html_url: 'https://github.com/justinovini/repo-b',
      updated_at: '2026-01-02T00:00:00Z',
      topics: ['frontend']
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsComponent, RepoCardComponent],
      imports: [
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: GithubService,
          useValue: {
            getUserWithRepos: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn((key) => {
                  if (key === 'username') return 'justinovini';
                  return null;
                })
              }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService);
  });

  it('deve criar o componente quando a página de resultados carregar', () => {
    // Arrange
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(of({ user: mockUser, repos: mockRepos }));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('deve exibir dados do usuário quando a API retornar sucesso', () => {
    // Arrange
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(of({ user: mockUser, repos: mockRepos }));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.user).toEqual(mockUser);
    expect(component.repos).toEqual(mockRepos);
    expect(component.loading).toBe(false);
  });

  it('deve calcular total de estrelas corretamente quando usuário tiver repositórios', () => {
    // Arrange
    const expectedTotal = 15; // 10 + 5
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(of({ user: mockUser, repos: mockRepos }));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.totalStars).toBe(expectedTotal);
  });

  it('deve definir notFound como true quando usuário não existir', () => {
    // Arrange
    const error = new HttpErrorResponse({ status: 404 });
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(throwError(() => error));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.notFound).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('deve definir errorMessage quando erro genérico ocorrer', () => {
    // Arrange
    const error = new HttpErrorResponse({ status: 500 });
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(throwError(() => error));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.errorMessage).toBe('Something went wrong while loading this user.');
    expect(component.loading).toBe(false);
  });

  it('deve filtrar repositórios quando filterText for preenchido', () => {
    // Arrange
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(of({ user: mockUser, repos: mockRepos }));
    component.ngOnInit();
    component.filterText = 'repo-a';

    // Act
    component.applyFiltersAndSort();

    // Assert
    expect(component.filteredRepos).toHaveLength(1);
    expect(component.filteredRepos[0].name).toBe('repo-a');
  });

  it('deve retornar lista vazia quando filtro não encontrar repositórios', () => {
    // Arrange
    jest
      .spyOn(githubService, 'getUserWithRepos')
      .mockReturnValue(of({ user: mockUser, repos: mockRepos }));
    component.ngOnInit();
    component.filterText = 'repo-inexistente';

    // Act
    component.applyFiltersAndSort();

    // Assert
    expect(component.filteredRepos).toHaveLength(0);
  });

  it('deve retornar id do repositório quando trackById for chamado', () => {
    // Arrange
    const repo = mockRepos[0];

    // Act
    const result = component.trackById(0, repo);

    // Assert
    expect(result).toBe(1);
  });
});
