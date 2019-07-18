import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ElementRef,
  AfterContentInit,
} from '@angular/core'
import { CloudinaryImage, Artwork } from 'src/app/models'
import { ClientService } from 'src/app/services/client.service'
// import { trigger, state, transition, animate, style } from '@angular/animations'

export enum ImageSize {
  FULLSCREEN = 0,
  LARGE = 1,
  HALFSCREEN = 2,
  SMALL = 3,
}

@Component({
  selector: 'app-smart-image',
  templateUrl: './smart-image.component.html',
  styleUrls: ['./smart-image.component.less'],
  animations: [
    // trigger('fade', [
    //   state('in', style({ opacity: 1 })),
    //   state('out', style({ opacity: 0 })),
    //   transition('in <=> out', animate('600ms ease')),
    // ]),
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartImageComponent implements OnInit, AfterContentInit {
  constructor(private client: ClientService, private el: ElementRef) {}

  onImagesLoaded() {
    // console.log('loaded!')
    this.loading = false
    this.loaded.emit('loaded')
  }

  @Input() image: CloudinaryImage
  @Input() imageClass: string = ''
  @Output() loaded = new EventEmitter<any>()
  @Output() imageClicked = new EventEmitter<SmartImageComponent>()

  private _size: ImageSize
  @Input()
  public get size() {
    return this._size
  }
  public set size(value: ImageSize) {
    this._size = value
    this.resolution =
      value == ImageSize.SMALL
        ? this.client.smallImageRes
        : value == ImageSize.HALFSCREEN
        ? this.client.halfScreenImageRes
        : value == ImageSize.LARGE
        ? this.client.largeImageRes
        : value == ImageSize.FULLSCREEN
        ? this.client.fullScreenImageRes
        : this.client.smallImageRes
  }

  loading = true
  resolution: { width: number; height: number } = {
    width: 0,
    height: 0,
  }

  get imageUrl() {
    return this.image.limit(this.resolution.width, this.resolution.height)
  }

  // @HostBinding('class.hover-fx')
  // hover_fx: boolean = false
  // @Input()
  // public get hoverFx() {
  //   return this.hover_fx
  // }
  // public set hoverFx(value) {
  //   this.hover_fx = value && this.client.isDesktop
  // }

  click() {
    // console.log('image click')
    this.imageClicked.emit(this)
  }

  ngOnInit() {
    if (this.resolution.width == 0) {
      this.resolution = this.client.smallImageRes
    }
  }

  // time: Date = new Date()
  ngAfterContentInit() {
    // console.log(
    //   'smart-image init: ',
    //   new Date().getTime() - this.time.getTime(),
    //   'ms'
    // )
  }
}
