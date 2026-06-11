import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubRepo } from '../../core/models/github-repo.model';
import { GithubUser } from '../../core/models/github-user.model';import { GithubService } from '../../core/services/github.service';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent implements OnInit {
  user: GithubUser | null = null;
  repos: GithubRepo[] = [];
  filteredRepos: GithubRepo[] = [];

  sortBy: 'stars' | 'name' = 'stars';
  sortDir: 'asc' | 'desc' = 'desc';
  filterText = '';
  totalStars = 0;

  loading = false;
  notFound = false;
  errorMessage = '';

  constructor(
    private readonly githubService: GithubService,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.loading = true;

    this.githubService.getUserWithRepos(username).subscribe({
      next: ({ user, repos }) => {
        this.user = user;
        this.repos = repos;
        this.totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        this.applyFiltersAndSort();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 404) {
          this.notFound = true;
          this.errorMessage = 'User not found';
          return;
        }

        this.errorMessage = 'Something went wrong while loading this user.';
        this.cdr.markForCheck();
      }
    });
  }

  applyFiltersAndSort(): void {
    let result = [...this.repos];

    if (this.filterText) {
      result = result.filter((repo) =>
        repo.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const valA = this.sortBy === 'stars' ? a.stargazers_count : a.name;
      const valB = this.sortBy === 'stars' ? b.stargazers_count : b.name;
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return this.sortDir === 'asc' ? cmp : -cmp;
    });

    this.filteredRepos = result;
  }

  trackById(index: number, repo: GithubRepo): number {
    return repo.id;
  }
}
