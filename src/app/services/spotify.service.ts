import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import Spotify from 'spotify-web-api-js';
import { IUser } from '../interfaces/IUser';
import { SpotifyArtistToLocalArtist, SpotifyPlaylistToLocalPlaylist, SpotifyTrackToLocalTrack, SpotifyUserToLocalUser } from '../common/spotifyHelper';
import { IPlaylist } from '../interfaces/IPlaylist';
import { Router } from '@angular/router';
import { IArtist } from '../interfaces/IArtist';
import { ISong } from '../interfaces/ISong';

@Injectable({
  providedIn: 'root'
})
export class 

SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  user: IUser;

  constructor(private router: Router) {
    this.spotifyApi = new Spotify();
  }

  async initializeUser() {
    if(!!this.user)
      return true;

    const token = localStorage.getItem('token');

    if(!token)
      return false;

    try {
      
      this.defineAccessToken(token);
      await this.getSpotifyUser();
      return !!this.user;

    } catch(execption) {
      return false;
    }
  }

  async getSpotifyUser() {
    const userInfo = await this.spotifyApi.getMe();
    this.user = SpotifyUserToLocalUser(userInfo);
  }

  getUrlLogin() {
    const authEndPoint = `${SpotifyConfiguration.authEndPoint}?`;
    const clientId = `client_id=${SpotifyConfiguration.clientId}&`
    const redirectUrl = `redirect_uri=${SpotifyConfiguration.redirectUrl}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`
    const responseType = `response_type=token&show_dialog=true`;
    return authEndPoint + clientId + redirectUrl + scopes + responseType;
  }

  getTokenUrlCallback() {
    if (!window.location.hash)
      return '';

    const params = window.location.href.substring(1).split('&');
    return params[0].split('=')[1];
  }

  defineAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
  }

  async searchUserPlaylist(offset = 0, limit = 50) : Promise<IPlaylist[]> {
    const playlists = await this.spotifyApi.getUserPlaylists(this.user.id, { offset, limit });
    return playlists.items.map(SpotifyPlaylistToLocalPlaylist);
  }

  async searchTopArtists(limit = 10) : Promise<IArtist[]> {
    const artists = await this.spotifyApi.getMyTopArtists({limit});
    return artists.items.map(SpotifyArtistToLocalArtist);
  }

  async getLikedSongs(offset = 0, limit=50): Promise<ISong[]>{
    const songs = await this.spotifyApi.getMySavedTracks({offset, limit});
    return songs.items.map(x => SpotifyTrackToLocalTrack(x.track));
  }

  async playSong(songId : string) {
    await this.spotifyApi.queue(songId);
    await this.spotifyApi.skipToNext();
  }

  async getCurrentSong(): Promise<ISong> {
    const song = await this.spotifyApi.getMyCurrentPlayingTrack();
    return SpotifyTrackToLocalTrack(song.item);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
