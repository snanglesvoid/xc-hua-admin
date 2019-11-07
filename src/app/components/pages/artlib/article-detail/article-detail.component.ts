import { Component, OnInit, Input } from '@angular/core'
import { LibArticle } from 'src/app/models/LibArticle'
import { LanguageService } from 'src/app/services/language.service'
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.less'],
})
export class ArticleDetailComponent implements OnInit {
  constructor(private lang: LanguageService, private api: ApiService) {}

  ngOnInit() {
    ;(window as any).detail = this
  }

  loading = false
  hasChanged = false

  @Input() data: LibArticle

  change() {
    this.data.translate(this.lang.language)
    this.hasChanged = true
  }

  public get model() {
    return this.data.getModel()
  }

  save() {
    this.loading = true
    this.api
      .saveLibArticle(this.data)
      .then(data => {
        Object.assign(this.data.getModel(), data.getModel())
        this.data.updateFromModel()
        this.hasChanged = false
        this.loading = false
      })
      .catch(error => {
        console.error(error)
        this.loading = false
      })
  }
}
