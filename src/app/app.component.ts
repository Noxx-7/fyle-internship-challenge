import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fyle-frontend-challenge';
  githubUsername = '';
  user: any;
  repositories: any[] = [];
  isLoadingUser = false;
  isLoadingRepos = false;
  currentPage = 1;
  itemsPerPage = 10;
  maxItemsPerPage = 100;
  isLoading = false;
  searchPerformed = false;

  constructor(private apiService: ApiService) {}

  private setLoadingStateWithDelay(isLoading: boolean, delay: number) {
    setTimeout(() => {
      this.isLoading = isLoading;
    }, delay);
  }

  setLoadingStates(isLoadingUser: boolean, isLoadingRepos: boolean) {
    this.isLoadingUser = isLoadingUser;
    this.isLoadingRepos = isLoadingRepos;
  }

  searchUser() {
    this.setLoadingStateWithDelay(true, 1000);
    this.apiService.getUser(this.githubUsername).subscribe(
      (user) => {
        this.searchPerformed = true;  // Set searchPerformed here
        this.user = user;
        this.loadRepositories();
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.setLoadingStates(false, false);
        this.user = null;
        this.repositories = [];
        this.setLoadingStateWithDelay(false, 0);
      }
    );
  }

  loadRepositories() {
    this.setLoadingStates(false, true);
    this.apiService.getReposWithPagination(this.githubUsername, this.currentPage, this.itemsPerPage).subscribe(
      (repos) => {
        this.repositories = repos;
        this.setLoadingStates(false, false);
        this.setLoadingStateWithDelay(false, 0);
      },
      (error) => {
        console.error('Error fetching repositories:', error);
        this.setLoadingStates(false, false);
        this.repositories = [];
        this.setLoadingStateWithDelay(false, 0);
      }
    );
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.loadRepositories();
  }

  getTechStack(repo: any): string {
    return repo.language || 'Tech Stack not specified';
  }

  changeItemsPerPage() {
    if (this.itemsPerPage > this.maxItemsPerPage) {
      this.itemsPerPage = this.maxItemsPerPage;
    }
    this.loadRepositories();
  }
}
