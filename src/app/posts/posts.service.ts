import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';

import { map, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(private http: HttpClient, private router: Router) {};

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, postsCount: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postsData) => {
        return {
          posts: postsData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          postsCount: postsData.postsCount
        };
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPostsData.postsCount
        });
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(
      'http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    console.log(postData)
    this.http.post<{post: Post, message: string}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath
        // };
        // console.log(responseData.message);
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    var postData: Post | FormData;
    if (typeof image == 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null }
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(response => {
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      // const post: Post = { id: id, title: title, content: content, imagePath: '' };
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + postId);
    // .subscribe(() => {
    //   this.postsUpdated.next([...this.posts.filter(post => post.id !== postId)]);
    // })
  }
}
