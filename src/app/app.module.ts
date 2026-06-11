import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { RepoDetailComponent } from './components/repo-detail/repo-detail.component';

// import { TuiRootModule } from '@taiga-ui/core';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    RepoDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
