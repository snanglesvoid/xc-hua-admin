import { ApiService } from '../services/api.service'
import { Model } from './Model'
import { Language } from '../services/language.service'
import { CloudinaryImageModel, CloudinaryImage } from './CloudinaryImage'

export interface PostModel {
  _id: string
  slug: string
  title: { english: string; german?: string; chinese?: string }
  image: CloudinaryImageModel
  content: {
    english?: { brief: string; extended: string }
    german?: { brief: string; extended: string }
    chinese?: { brief: string; extended: string }
  }
  publishedDate: Date
}

export class Post extends Model {
  constructor(api: ApiService, private model: PostModel) {
    super(api)
    this.updateFromModel()
  }
  public updateFromModel() {
    this._image = new CloudinaryImage(this.api, this.model.image)
  }

  public get id() {
    return this.model._id
  }
  public getModel() {
    return this.model
  }
  public get slug() {
    return this.model.slug
  }
  private _title: string
  public get title() {
    return this._title
  }
  private _image: CloudinaryImage
  public get image() {
    return this._image
  }
  private _content: {
    brief?: string
    extended?: string
  }
  public get content() {
    return this._content
  }
  public get publishedDate() {
    return new Date(this.model.publishedDate)
  }

  translate(language: Language) {
    this._title = this.model.title[language] || this.model.title.english
    this._content = this.model.content[language] ||
      this.model.content.english || { brief: '', extended: '' }
  }
}
