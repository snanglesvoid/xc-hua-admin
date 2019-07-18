import { Model } from './Model'
import { CloudinaryImageModel, CloudinaryImage } from './CloudinaryImage'
import { GallerySpaceModel, GallerySpace } from './GallerySpace'
import { ArtistModel, Artist, ArtworkModel, Artwork } from './Artist'
import { ApiService } from '../services/api.service'
import { Language } from '../services/language.service'

export interface ExhibitionModel {
  _id: string
  slug: string
  title: { english: string; german?: string; chinese?: string }
  date: { start: Date; end: Date }
  text: { english?: string; german?: string; chinese?: string }
  location: GallerySpaceModel | string
  artists: (ArtistModel | string)[]
  coverPicture?: CloudinaryImageModel
  pictures: CloudinaryImageModel[]
  artworks: (ArtworkModel | string)[]
}

export class Exhibition extends Model {
  constructor(api: ApiService, private model: ExhibitionModel) {
    super(api)

    if (typeof model.location === 'string') {
      this._location = model.location
    } else {
      this._location = new GallerySpace(
        api,
        model.location as GallerySpaceModel
      )
    }
    if (
      model.artists &&
      model.artists.length &&
      typeof model.artists[0] === 'string'
    ) {
      this._artists = model.artists as string[]
    } else {
      this._artists = model.artists.map(x => new Artist(api, x as ArtistModel))
    }
    if (
      model.artworks &&
      model.artworks.length &&
      typeof model.artworks === 'string'
    ) {
      this._artworks = model.artworks as string[]
    } else {
      // console.log(model.artworks)
      this._artworks = model.artworks.map(
        x => new Artwork(api, x as ArtworkModel)
      )
    }
    this._start = new Date(model.date.start)
    this._end = new Date(model.date.end)
    this._coverPicture = new CloudinaryImage(api, model.coverPicture)
    this._pictures =
      model.pictures && model.pictures.length
        ? model.pictures.map(p => new CloudinaryImage(api, p))
        : []
  }

  public updateFromModel() {}
  public get id() {
    return this.model._id
  }
  public get slug() {
    return this.model.slug
  }
  private _title: string = ''
  public get title() {
    return this._title
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
  private _location: string | GallerySpace
  public get location() {
    return this._location
  }
  private _coverPicture: CloudinaryImage
  public get coverPicture() {
    return this._coverPicture
  }
  private _pictures: CloudinaryImage[]
  public get pictures() {
    return this._pictures
  }
  private _artworks: (Artwork | string)[]
  public get artworks() {
    return this._artworks
  }
  public getModel() {
    return this.model
  }

  public translate(language: Language) {
    // console.log('translate', this)
    this._title = this.model.title[language] || this.model.title.english
    this._text = this.model.text[language] || this.model.text.english || ''

    if (this.location instanceof GallerySpace) {
      this.location.translate(language)
    }
    if (
      this.artists &&
      this.artists.length &&
      this.artists[0] instanceof Artist
    ) {
      this.artists.forEach((x: Artist) => x.translate(language))
    }
    if (
      this.artworks &&
      this.artworks.length &&
      this.artworks[0] instanceof Artwork
    ) {
      this.artworks.forEach((x: Artwork) => x.translate(language))
    }
  }

  public populate(field: string) {
    return Promise.reject('Not implemented')
  }
}
