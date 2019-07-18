import { Model } from './Model'
import { ApiService } from '../services/api.service'
import { Language } from '../services/language.service'

export interface TextblockModel {
  _id: string
  slug: string
  title: string
  content: { english: string; german?: string; chinese?: string }
}

export class Textblock extends Model {
  constructor(api: ApiService, private model: TextblockModel) {
    super(api)
  }

  public updateFromModel() {}

  public get id() {
    return this.model._id
  }
  public get slug() {
    return this.model.slug
  }
  public get title() {
    return this.model.title
  }
  private _content: string
  public get content() {
    return this._content
  }
  public getModel() {
    return this.model
  }

  public translate(language: Language) {
    this._content =
      this.model.content[language] || this.model.content.english || ''
  }
}
