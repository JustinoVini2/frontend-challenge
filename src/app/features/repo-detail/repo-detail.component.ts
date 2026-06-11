import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GithubRepo } from '../../core/models/github-repo.model';
import { GithubService } from '../../core/services/github.service';

@Component({
  selector: 'app-repo-detail',
  templateUrl: './repo-detail.component.html',
  styleUrls: ['./repo-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoDetailComponent implements OnInit {
  repo: GithubRepo | null = null;
  loading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly githubService: GithubService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')!;
    const repo = this.route.snapshot.paramMap.get('repo')!;

    this.loading = true;
    this.githubService.getRepo(username, repo).subscribe({
      next: (result) => {
        this.repo = result;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  trackByTopic(index: number, topic: string): string {
    return `${topic}-${index}`;
  }
}
