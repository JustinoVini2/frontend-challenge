import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RepoDetailComponent } from './repo-detail.component';
import { GithubService } from '../../core/services/github.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('RepoDetailComponent', () => {
  let component: RepoDetailComponent;
  let fixture: ComponentFixture<RepoDetailComponent>;
  let githubService: GithubService;
  let location: Location;

  const mockRepo = {
    id: 1,
    name: 'repo-a',
    full_name: 'justinovini/repo-a',
    description: 'Repositorio A',
    stargazers_count: 25,
    forks_count: 5,
    language: 'TypeScript',
    html_url: 'https://github.com/justinovini/repo-a',
    updated_at: '2026-01-01T00:00:00Z',
    topics: ['angular', 'typescript', 'frontend']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepoDetailComponent],
      imports: [
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: GithubService,
          useValue: {
            getRepo: jest.fn()
          }
        },
        {
          provide: Location,
          useValue: { back: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn((key) => {
                  if (key === 'username') return 'justinovini';
                  if (key === 'repo') return 'repo-a';
                  return null;
                })
              }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(RepoDetailComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService);
    location = TestBed.inject(Location);
  });

  it('deve criar o componente quando a página de detalhe carregar', () => {
    jest.spyOn(githubService, 'getRepo').mockReturnValue(of(mockRepo));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve exibir dados do repositório quando API retornar sucesso', () => {
    jest.spyOn(githubService, 'getRepo').mockReturnValue(of(mockRepo));
    component.ngOnInit();
    expect(component.repo).toEqual(mockRepo);
    expect(component.loading).toBe(false);
  });

  it('deve chamar getRepo com owner e nome corretos', () => {
    jest.spyOn(githubService, 'getRepo').mockReturnValue(of(mockRepo));
    component.ngOnInit();
    expect(githubService.getRepo).toHaveBeenCalledWith('justinovini', 'repo-a');
  });

  it('deve definir loading como false quando repositório for carregado', () => {
    jest.spyOn(githubService, 'getRepo').mockReturnValue(of(mockRepo));
    component.ngOnInit();
    expect(component.loading).toBe(false);
  });

  it('deve definir loading como false quando erro 404 ocorrer', () => {
    const error = new HttpErrorResponse({ status: 404 });
    jest.spyOn(githubService, 'getRepo').mockReturnValue(throwError(() => error));
    component.ngOnInit();
    expect(component.loading).toBe(false);
  });

  it('deve voltar para página anterior quando goBack for chamado', () => {
    jest.spyOn(githubService, 'getRepo').mockReturnValue(of(mockRepo));
    component.ngOnInit();
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('deve retornar topic e index concatenados quando trackByTopic for chamado', () => {
    jest.spyOn(githubService, 'getRepo').mockReturnValue(of(mockRepo));
    component.ngOnInit();
    const result = component.trackByTopic(0, 'angular');
    expect(result).toBe('angular-0');
  });
});
