import { Component, OnInit, OnDestroy, NgZone } from '@angular/core'
import { FrontPageImage } from 'src/app/models'
import { ApiService } from 'src/app/services/api.service'
import { Observable, from, Subject } from 'rxjs'
import { switchMap, share, tap } from 'rxjs/operators'

@Component({
  selector: 'app-front-page-images',
  templateUrl: './front-page-images.component.html',
  styleUrls: ['./front-page-images.component.less'],
})
export class FrontPageImagesComponent implements OnInit, OnDestroy {
  private dataChangeSubscription
  slides: FrontPageImage[] = []
  selectedSlide: FrontPageImage
  loading: boolean = false

  view = 'desktop'

  constructor(private api: ApiService, private zone: NgZone) {}

  ngOnInit() {
    this.dataChangeSubscription = this.api.frontPageImages.dataChanged.subscribe(
      _ => this.updateData()
    )
    this.updateData()
  }

  ngOnDestroy() {
    this.dataChangeSubscription.unsubscribe()
  }

  i = 0
  async updateData() {
    this.i++
    this.loading = true
    console.log('update data')
    await this.api.frontPageImages.waitForData(this.i == 1)
    this.zone.run(() => {
      this.slides = [...this.api.frontPageImages.data]
      console.log('slides', this.slides)
      this.loading = false
    })
  }

  discardChanges() {
    window.location.reload()
  }

  save() {}
}
