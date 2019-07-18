import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core'
import { FrontPageImage, GallerySpace } from 'src/app/models'
import { LanguageService } from 'src/app/services/language.service'
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: ['./slide-detail.component.less'],
})
export class SlideDetailComponent implements OnInit, OnDestroy {
  constructor(private lang: LanguageService, private api: ApiService) {}

  ngOnInit() {
    this.updateSubscription = this.api.gallerySpaces.dataChanged.subscribe(_ =>
      this.updateData()
    )
    this.updateData()
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe()
  }

  loading = false
  hasChanged = false

  async updateData() {
    await this.api.gallerySpaces.waitForData()
    this.locations = this.api.gallerySpaces.data
    console.log('locations', this.locations)
  }

  locations: GallerySpace[] = []
  updateSubscription

  private _slide: FrontPageImage
  @Input()
  public get slide() {
    return this._slide
  }
  public set slide(value) {
    if (this._slide) this._slide.animationState = this.hasChanged
    this._slide = value
    this.hasChanged = value.animationState || false
  }

  get model() {
    return this.slide.getModel()
  }

  change() {
    this.slide.translate(this.lang.language)
    this.hasChanged = true
  }

  colorChange() {
    console.log('color change', this.model.customColor)
    this.change()
  }

  save() {
    this.loading = true
    this.api
      .saveFrontPageImage(this.slide)
      .then(data => {
        this.slide = data
        this.hasChanged = false
        this.loading = false
      })
      .catch(error => {
        console.error(error)
        this.loading = false
      })
  }
}
