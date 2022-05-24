import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";

import { Subscription } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 4, 10]
  userAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsService.getPostUpdateListener()
      .subscribe((postsData: {posts: Post[], postsCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postsData.postsCount;
        this.posts = postsData.posts;
    });
    this.userAuthenticated = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe({
      next: () => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
    this.authListenerSubs.unsubscribe();
  }
}
