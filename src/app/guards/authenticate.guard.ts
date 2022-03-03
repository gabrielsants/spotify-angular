import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanLoad {

  constructor(private router: Router, private spotifyService : SpotifyService) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token');

    if (!token) {
      return this.notAuthenticated();
    }

    return new Promise(async (res) => {
      const user = await this.spotifyService.initializeUser();
      if(user)
        res(true);
      else
        res(this.notAuthenticated());
    });
  }

  notAuthenticated() {
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }
}
