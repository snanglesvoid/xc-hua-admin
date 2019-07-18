import { Name, Model } from './Model'
import { CloudinaryImageModel, CloudinaryImage } from './CloudinaryImage'
import { Language } from '../services/language.service'
import { ApiService } from '../services/api.service'
import { ArtworkSeries } from './ArtworkSeries'
import { Exhibition } from './Exhibition'
import { Fair } from './Fair'

import { Observable, from, of } from 'rxjs'

export type ArtistType = 'resident' | 'guest'

export interface ArtworkModel {
  _id: string
  slug: string
  title: {
    english: string
    german?: string
    chinese?: string
  }
  image?: CloudinaryImageModel
  pictures?: CloudinaryImageModel[]
  year?: string
  description: {
    english?: string
    german?: string
    chinese?: string
  }
  dimensions?: string
  price?: string
  availability: boolean
  artist: ArtistModel | string
  artistName: {
    english?: string
    german?: string
    chinese?: string
  }
}

export class Artwork extends Model {
  constructor(api: ApiService, private model: ArtworkModel) {
    super(api)
    this.updateFromModel()
    this._title = this.model.title.english
    this._description = this.model.description
      ? this.model.description.english || ''
      : 'NULL'
    this._artist =
      typeof model.artist === 'string'
        ? model.artist
        : model.artist
        ? new Artist(api, model.artist)
        : null
    this._artistName = this.model.artistName
      ? this.model.artistName.english || ''
      : ''
  }

  updateFromModel() {
    this._image = new CloudinaryImage(this.api, this.model.image)
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
  private _description
  public get description() {
    return this._description
  }
  private _image: CloudinaryImage
  public get image() {
    return this._image
  }
  private _pictures: CloudinaryImage[] = []
  public get pictures() {
    return this._pictures
  }
  public get year() {
    return this.model.year || ''
  }
  public get dimensions() {
    return this.model.dimensions || ''
  }
  public get price() {
    return this.model.price || ''
  }
  public get availability() {
    return this.model.availability
  }
  private _artist: string | Artist
  public get artist() {
    return this._artist
  }
  public set artist(artist: Artist | string) {
    this._artist = artist
  }
  private _artistName: string
  public get artistName() {
    return this._artistName
  }

  public getModel() {
    return this.model
  }

  public translate(language: Language) {
    super.translate(language)
    this._title = this.model.title[language] || this.model.title.english
    this._description = this.model.description
      ? this.model.description[language] || this.model.description.english || ''
      : 'NULL'
    this._artistName = this.model.artistName
      ? this.model.artistName[language] || this.model.artistName.english || ''
      : 'NULL'
    if (this.artist instanceof Artist) this.artist.translate(language)
  }

  public async populate(field: string) {
    if (field === 'artist') {
      return Promise.reject('not implemented')
    } else {
      return Promise.reject('Unknown Field Name: ' + field)
    }
  }
}

export interface ArtistModel {
  _id: string
  slug: string
  name: {
    english: Name
    german?: Name
    chinese?: Name
  }
  artistType: ArtistType
  biography: {
    english: string
    german?: string
    chinese?: string
  }
  picture?: CloudinaryImageModel
  thumbnail?: CloudinaryImageModel
  selectedWork?: ArtworkModel | string
  listPriority: number
}

export class Artist extends Model {
  constructor(api: ApiService, private model: ArtistModel) {
    super(api)
    this.updateFromModel()
    if (model.selectedWork && typeof model.selectedWork !== 'string') {
      this._selectedWork = new Artwork(api, model.selectedWork as ArtworkModel)
    } else {
      this._selectedWork = model.selectedWork as string
    }
  }
  public updateFromModel() {
    this._picture = new CloudinaryImage(this.api, this.model.picture)
    this._thumbnail = new CloudinaryImage(this.api, this.model.thumbnail)
  }
  public getModel() {
    return this.model
  }
  public get id() {
    return this.model._id
  }
  private _name: Name
  public get slug() {
    return this.model.slug
  }
  public get name() {
    return this._name
  }
  public get artistType() {
    return this.model.artistType
  }
  private _biography: string
  public get biography() {
    return this._biography
  }
  private _picture: CloudinaryImage
  public get picture() {
    return this._picture
  }
  private _thumbnail: CloudinaryImage
  public get thumbnail() {
    return this._thumbnail
  }
  private _selectedWork?: Artwork | string
  public get selectedWork() {
    return this._selectedWork
  }

  private _artworks?: Artwork[]
  public get artworks() {
    return this._artworks
  }
  private _series?: ArtworkSeries[]
  private _exhibitions?: Exhibition[]
  private _fairs?: Fair[]

  translate(language: Language) {
    super.translate(language)
    if (this.model.name[language] && this.model.name[language].first) {
      this._name = this.model.name[language]
    } else {
      this._name = this.model.name.english
    }
    if (this.model.biography) {
      this._biography =
        this.model.biography[language] || this.model.biography.english || ''
    } else {
      this._biography = ''
    }
    if (this._selectedWork instanceof Artwork) {
      this._selectedWork.translate(language)
    }
    if (this._artworks) {
      this._artworks.forEach(a => a.translate(language))
    }
    if (this._series) {
      this._series.forEach(x => x.translate(language))
    }
    if (this._exhibitions) {
      this._exhibitions.forEach(x => x.translate(language))
    }
    if (this._fairs) {
      this._fairs.forEach(x => x.translate(language))
    }
  }

  async populate(field: string) {
    if (field === 'selectedWork') {
      if (this._selectedWork instanceof Artwork) {
        return Promise.resolve('Already populated')
      } else {
        //TODO
        return Promise.reject('Not implemented')
      }
    } else if (field === 'artworks') {
      if (this.artworks) {
        return Promise.resolve(this.artworks)
      }
      try {
        let aws = await this.api.artworks.waitForData()
        this._artworks = aws.filter(aw => {
          ;(aw.artist as string) === this.id
        })
        this._artworks.forEach(aw => {
          aw.artist = this
        })
        return Promise.resolve(this.artworks)
      } catch (error) {
        return Promise.reject(error)
      }
    } else if (field === 'series') {
      return Promise.reject('Not implemented')
    } else if (field === 'exhibitions') {
      return Promise.reject('Not implemented')
    } else if (field === 'fairs') {
      return Promise.reject('Not implemented')
    } else {
      return Promise.reject('Unknown field name: ' + field)
    }
  }
}
