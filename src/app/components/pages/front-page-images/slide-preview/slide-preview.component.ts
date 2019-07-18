import { Component, OnInit, Input } from '@angular/core'
import { FrontPageImage } from 'src/app/models'

@Component({
  selector: 'app-slide-preview',
  templateUrl: './slide-preview.component.html',
  styleUrls: ['./slide-preview.component.less'],
})
export class SlidePreviewComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    ;(window as any).preivew = this
  }

  @Input() slide: FrontPageImage

  classesFor(slide: FrontPageImage) {
    let res: any = {}
    res[slide.textPlacement] = true
    res[slide.textColor] = true
    return res
  }

  customColor() {
    return this.slide.textColor === 'custom' ? this.slide.customColor : ''
  }
}
