import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faGuitar, faHome, faMusic, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IPlaylist } from 'src/app/interfaces/IPlaylist';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  homeIcon = faHome;
  searchIcon = faSearch;
  artistsIcon = faGuitar;
  playlistIcon = faMusic;

  selectedMenu = 'Home';

  playlists : IPlaylist[] = [];
  
  constructor(private spotifyService : SpotifyService, private router: Router) { }

  ngOnInit(): void {
    this.getPlaylists();
  }

  buttonClick(button : string) {
    this.selectedMenu = button;
    this.router.navigateByUrl(`player/${button}`)
  }

  async getPlaylists() {
    this.playlists = await this.spotifyService.searchUserPlaylist();
  }
}
