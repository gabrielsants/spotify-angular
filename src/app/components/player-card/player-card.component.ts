import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPause, faPlay, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { newSong } from 'src/app/common/factories';
import { ISong } from 'src/app/interfaces/ISong';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit, OnDestroy {

  currentSong : ISong = newSong();
  subs: Subscription[] = [];

  iconNext = faStepForward
  iconPrevius = faStepBackward;
  iconPlay = faPlay;
  iconPause = faPause;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.getCurrentSong();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe);   
  }

   getCurrentSong() {
    const sub = this.playerService.currentSong.subscribe(song => {
      this.currentSong = song;
    });
    this.subs.push(sub);
  }

}
