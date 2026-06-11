import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from 'src/app/core/github.service';
import { GithubRepo } from 'src/app/models/github-repo.model';
import { GithubUser } from 'src/app/models/github-user.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  user: GithubUser | null = null;
  repos: GithubRepo[] = [];
  filteredRepos: GithubRepo[] = [];

  sortBy: 'stars' | 'name' = 'stars';
  sortDir: 'asc' | 'desc' = 'desc';
  filterText = '';

  constructor(private githubService: GithubService, private route: ActivatedRoute) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.githubService.getUserWithRepos(username).subscribe(({ user, repos }) => {
      this.user = user;
      this.repos = repos;
      this.applyFiltersAndSort();
    });
  }

  applyFiltersAndSort() {
    let result = [...this.repos];

    // Filtro por nome
    if (this.filterText) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    // Ordenação
    result.sort((a, b) => {
      const valA = this.sortBy === 'stars' ? a.stargazers_count : a.name;
      const valB = this.sortBy === 'stars' ? b.stargazers_count : b.name;
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return this.sortDir === 'asc' ? cmp : -cmp;
    });

    this.filteredRepos = result;

  }
}
