import { Model } from './Model'
import { Language } from '../services/language.service'
import { ArtistModel, Artist, ArtworkModel, Artwork } from './Artist'
import { ApiService } from '../services/api.service'

export interface ArtworkSeriesModel {
  _id: string
  slug: string
  title: { english: string; german?: string; chinese?: string }
  artist: ArtistModel | string
  artworks: ArtworkModel[]
  selectedWork: ArtworkModel | string
}

export class ArtworkSeries extends Model {
  constructor(api: ApiService, private model: ArtworkSeriesModel) {
    super(api)
    if (typeof model.artist === 'string') {
      this._artist = model.artist
    } else {
      this._artist = new Artist(api, model.artist as ArtistModel)
    }

    this._artworks = model.artworks.map(x => {
      return new Artwork(api, x as ArtworkModel)
    })
    if (typeof model.selectedWork === 'string') {
      this._selectedWork = model.selectedWork
    } else if (model.selectedWork) {
      this._selectedWork = new Artwork(api, model.selectedWork as ArtworkModel)
    } else if (this.artworks.length > 0) {
      this._selectedWork = this.artworks[0]
    } else {
      throw new Error('Empty Series!!!!')
    }
    this._title = this.model.title.english
  }
  public updateFromModel() {}
  public getModel() {
    return this.model
  }
  public get id() {
    return this.model._id
  }
  public get slug() {
    return this.model.slug
  }
  private _title: string
  public get title() {
    return this._title
  }
  private _artist: Artist | string
  public get artist() {
    return this._artist
  }
  private _selectedWork: Artwork | string
  public get selectedWork() {
    return this._selectedWork
  }
  private _artworks: Artwork[]
  public get artworks() {
    return this._artworks
  }

  translate(language: Language) {
    this._title = this.model.title[language] || this.model.title.english
  }

  populate(field: string) {
    return Promise.reject('Not implemented')
  }
}
