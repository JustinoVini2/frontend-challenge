import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './search.component';
import { GithubService } from '../../core/services/github.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  let githubService: GithubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: GithubService,
          useValue: {
            getUser: jest.fn()
          }
        }
      ]
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    githubService = TestBed.inject(GithubService);
    fixture.detectChanges();
  });

  it('deve criar o componente quando inicializar a página de busca', () => {
    const instance = component;
    const isCreated = Boolean(instance);
    expect(isCreated).toBe(true);
  });

  it('deve navegar quando usuário válido for encontrado', () => {
    component.username.setValue('justinovini');
    const mockUser = {
      login: 'justinovini',
      name: 'Vinicius',
      bio: 'Engineer',
      avatar_url: 'https://example.com/avatar.png',
      followers: 5,
      following: 3,
      public_repos: 10,
      location: 'Sao Paulo',
      html_url: 'https://github.com/justinovini'
    };
    jest.spyOn(githubService, 'getUser').mockReturnValue(of(mockUser));
    component.submit();
    expect(router.navigate).toHaveBeenCalledWith(['/user', 'justinovini']);
  });

  it('deve mostrar erro 404 quando usuário não existir', () => {
    component.username.setValue('usuario-inexistente');
    const error = new HttpErrorResponse({ status: 404 });
    jest.spyOn(githubService, 'getUser').mockReturnValue(throwError(() => error));

    component.submit();

    expect(component.notFound).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('deve mostrar erro genérico quando API falhar', () => {
    component.username.setValue('justinovini');
    const error = new HttpErrorResponse({ status: 500 });
    jest.spyOn(githubService, 'getUser').mockReturnValue(throwError(() => error));

    component.submit();

    expect(component.genericError).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('deve não navegar quando campo de busca estiver vazio', () => {
    component.username.setValue('');

    component.submit();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('deve não navegar quando campo contiver apenas espaços em branco', () => {
    component.username.setValue('   ');
    component.username.setValue('   ');
    component.submit();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
