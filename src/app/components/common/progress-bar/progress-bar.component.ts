import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.less'],
})
export class ProgressBarComponent implements OnInit {
  @Input() progress: number = 0

  constructor() {}

  ngOnInit() {}

  get width() {
    return (this.progress * 100).toString() + '%'
  }
}
