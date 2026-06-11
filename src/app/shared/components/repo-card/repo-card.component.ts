import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GithubRepo } from '../../../core/models/github-repo.model';

@Component({
  selector: 'app-repo-card',
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoCardComponent {
  @Input({ required: true }) repo!: GithubRepo;
  @Input({ required: true }) username!: string;

  get languageColor(): string {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      HTML: '#e34c26',
      CSS: '#264de4',
      SCSS: '#c6538c',
      Java: '#b07219',
      Python: '#3572a5'
    };

    return colors[this.repo.language] ?? '#616161';
  }

  trackByTopic(index: number, topic: string): string {
    return `${topic}-${index}`;
  }
}
