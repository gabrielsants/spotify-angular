import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-researchs',
  templateUrl: './recent-researchs.component.html',
  styleUrls: ['./recent-researchs.component.scss']
})
export class RecentResearchsComponent implements OnInit {

  recentReserchs = [
    'Rock 4 ever',
    '2 Pac',
    'Avenged 7fold',
    'Love songs'
  ];

  input = ''

  constructor() { }

  ngOnInit(): void {
  }

  search(input: string) {
    this.input = input;
  }

  doSearch() {
    console.log('Searching, please hold up');
  }

}
