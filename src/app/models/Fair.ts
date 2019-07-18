import { CloudinaryImageModel, CloudinaryImage } from './CloudinaryImage'
import { ArtistModel, Artist } from './Artist'
import { ApiService } from '../services/api.service'
import { Language } from '../services/language.service'
import { Model } from './Model'

export interface FairModel {
  _id: string
  slug: string
  title: { english: string; german?: string; chinese?: string }
  thumbnail: CloudinaryImageModel
  date: { start: Date; end: Date }
  text: { english?: string; german?: string; chinese?: string }
  artists: (ArtistModel | string)[]
}

export class Fair extends Model {
  constructor(api: ApiService, private model: FairModel) {
    super(api)
    this._thumbnail = new CloudinaryImage(
      api,
      model.thumbnail as CloudinaryImageModel
    )

    if (
      model.artists &&
      model.artists.length &&
      typeof model.artists[0] === 'string'
    ) {
      this._artists = model.artists as string[]
    } else {
      this._artists = model.artists.map(x => new Artist(api, x as ArtistModel))
    }
    this._start = new Date(model.date.start)
    this._end = new Date(model.date.end)
  }
  public updateFromModel() {}

  public get id() {
    return this.model._id
  }
  public get slug() {
    return this.model.slug
  }
  private _title: string = this.model.title.english
  public get title() {
    return this._title
  }
  private _thumbnail: CloudinaryImage
  public get thumbnail() {
    return this._thumbnail
  }
  private _start: Date
  private _end: Date
  public get start() {
    return this._start
  }
  public get end() {
    return this._end
  }
  private _text: string
  public get text() {
    return this._text
  }
  private _artists: (Artist | string)[]
  public get artists() {
    return this._artists
  }
  public getModel() {
    return this.model
  }

  public translate(language: Language) {
    this._title = this.model.title[language] || this.model.title.english
    this._text = this.model.text
      ? this.model.text[language] || this.model.text.english || ''
      : ''
    if (
      this.artists &&
      this.artists.length &&
      this.artists[0] instanceof Artist
    ) {
      this.artists.forEach((x: Artist) => x.translate(language))
    }
  }

  populate(field: string) {
    if (field === 'artists') {
      return Promise.reject('not implemented')
    } else {
      return Promise.reject('Unknown field name')
    }
  }
}
