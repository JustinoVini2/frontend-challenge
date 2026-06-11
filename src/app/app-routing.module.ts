import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepoDetailComponent } from './features/repo-detail/repo-detail.component';
import { ResultsComponent } from './features/results/results.component';
import { SearchComponent } from './features/search/search.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'user/:username', component: ResultsComponent },
  { path: 'user/:username/repo/:repo', component: RepoDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
