import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService } from '../../core/services/github.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  readonly username = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  submitted = false;
  loading = false;
  notFound = false;
  genericError = false;

  constructor(
    private readonly router: Router,
    private readonly githubService: GithubService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  submit(): void {
    this.submitted = true;
    this.username.markAsTouched();
    this.notFound = false;
    this.genericError = false;

    const username = this.username.value.trim();
    if (this.username.invalid || !username) {
      return;
    }

    this.loading = true;
    this.githubService.getUser(username).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/user', username]);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.notFound = error.status === 404;
        this.genericError = error.status !== 404;
        this.cdr.markForCheck();
      }
    });
  }
}
