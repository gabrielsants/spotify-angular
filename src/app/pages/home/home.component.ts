import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ISong } from 'src/app/interfaces/ISong';
import { SpotifyService } from 'src/app/services/spotify.service';
import { PlayerService } from 'src/app/services/player.service';
import { newSong } from 'src/app/common/factories';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  songs: ISong[] = [];
  playIcon = faPlay;
  currentSong: ISong = newSong();

  subs: Subscription[] = [];

  constructor(private spotifyService: SpotifyService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.getLikedSongs();
    this.getCurrentSong();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async getLikedSongs() {
    this.songs = await this.spotifyService.getLikedSongs();
    console.log(this.songs)
  }

  getArtists(song: ISong) {
    return song.artists.map(artist => artist.name).join(', ');
  }

  async playSong(song: ISong) {
    await this.spotifyService.playSong(song.id);
    this.playerService.setCurrentSong(song);
  }

  getCurrentSong() {
    const sub = this.playerService.currentSong.subscribe(song => {
      this.currentSong = song;
    });
    this.subs.push(sub);
  }

}
