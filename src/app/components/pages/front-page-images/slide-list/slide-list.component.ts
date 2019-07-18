import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core'
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
} from '@angular/cdk/drag-drop'
import { FrontPageImage, GallerySpace } from 'src/app/models'
import {
  trigger,
  state,
  animate,
  style,
  transition,
  query,
  stagger,
} from '@angular/animations'
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.less'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':leave',
          [stagger(100, [animate('0.5s', style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            stagger(100, [animate('0.5s', style({ opacity: 1 }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class SlideListComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit() {}

  private _slides: FrontPageImage[]
  activeItems: FrontPageImage[] = []
  inactiveItems: FrontPageImage[] = []
  loading = false

  @Input()
  public get slides() {
    return this._slides
  }
  public set slides(value) {
    console.log('set slides')
    this._slides = value
    this.activeItems = value.filter(x => x.active)
    this.inactiveItems = value.filter(x => !x.active)
  }

  selectedItem = null

  @Output() slideSelected = new EventEmitter<FrontPageImage>()

  @ViewChild('slideDelete') deleteDropArea: CdkDropList

  dropped($event: CdkDragDrop<FrontPageImage[]>) {
    console.log($event)
    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      )
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      )
    }
    this.activeItems.forEach((x, i) => {
      x.getModel().listPriority = i
    })
    this.inactiveItems.forEach((x, i) => {
      x.getModel().listPriority = i + this.activeItems.length
    })
    this.activeItems.forEach(x => (x.getModel().active = true))
    this.inactiveItems.forEach(x => (x.getModel().active = false))
    this.loading = true
    this.api
      .updateFrontPageImageOrder()
      .then(_ => (this.loading = false))
      .catch(err => {
        console.error(err)
        this.loading = false
      })
  }

  itemClicked(item) {
    console.log(item)
    this.selectedItem = item
    this.slideSelected.emit(item)
  }

  delete(item, list: Array<any>) {
    console.log('delete')
    if (!confirm('are you sure you want to delete: ' + item.slug)) return
    this.loading = true
    this.api
      .deleteFrontPageImage(item)
      .then(_ => (this.loading = false))
      .catch(err => {
        console.error(err)
        this.loading = false
      })
  }
  duplicate(item: FrontPageImage, list: Array<any>) {
    console.log('duplicate')
    this.loading = true
    this.api
      .copyFrontPageImage(item)
      .then(data => {
        this.loading = false
      })
      .catch(err => {
        console.error(err)
        this.loading = false
      })
  }
}
