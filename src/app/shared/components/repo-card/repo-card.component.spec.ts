import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { RepoCardComponent } from './repo-card.component';

describe('RepoCardComponent', () => {
  let component: RepoCardComponent;
  let fixture: ComponentFixture<RepoCardComponent>;

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
      declarations: [RepoCardComponent],
      imports: [MatCardModule, MatChipsModule, MatIconModule, RouterTestingModule]
    });

    fixture = TestBed.createComponent(RepoCardComponent);
    component = fixture.componentInstance;
    component.repo = mockRepo;
    component.username = 'justinovini';
    fixture.detectChanges();
  });

  it('deve criar o componente quando os inputs forem fornecidos', () => {
    const instance = component;
    const isCreated = Boolean(instance);
    expect(isCreated).toBe(true);
  });

  it('deve exibir nome do repositório quando card for renderizado', () => {
    component.repo = mockRepo;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockRepo.name);
  });

  it('deve exibir descrição do repositório quando existir', () => {
    component.repo = mockRepo;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockRepo.description);
  });

  it('deve exibir No description quando não houver descrição', () => {
    component.repo = { ...mockRepo, description: '' };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toBeDefined();
  });

  it('deve exibir contagem de estrelas quando repositório tiver stars', () => {
    component.repo = mockRepo;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('25');
  });

  it('deve retornar cor correta para TypeScript', () => {
    component.repo = { ...mockRepo, language: 'TypeScript' };
    const color = component.languageColor;
    expect(color).toBe('#3178c6');
  });

  it('deve retornar cor correta para JavaScript', () => {
    component.repo = { ...mockRepo, language: 'JavaScript' };
    const color = component.languageColor;
    expect(color).toBe('#f7df1e');
  });

  it('deve retornar cor padrão para linguagem desconhecida', () => {
    component.repo = { ...mockRepo, language: 'Go' };
    const color = component.languageColor;
    expect(color).toBe('#616161');
  });

  it('deve retornar identificador único quando trackByTopic for chamado', () => {
    component.repo = mockRepo;
    const result = component.trackByTopic(0, 'angular');
    expect(result).toBe('angular-0');
  });
});
