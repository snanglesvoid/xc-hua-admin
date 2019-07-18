import { ApiService } from '../services/api.service'
import { Language } from '../services/language.service'
import { Model } from './Model'
import { CloudinaryImageModel, CloudinaryImage } from './CloudinaryImage'

export interface GallerySpaceModel {
  _id: string
  location: { english: string; german?: string; chinese?: string }
  address: { english?: string; german?: string; chinese?: string }
  phone?: string
  openingHours: { english?: string; german?: string; chinese?: string }
  image: CloudinaryImageModel
}

export class GallerySpace extends Model {
  constructor(api: ApiService, private model: GallerySpaceModel) {
    super(api)
    this._image = new CloudinaryImage(api, model.image)
  }
  public updateFromModel() {}
  public get id() {
    return this.model._id
  }
  public get phone() {
    return this.model.phone
  }
  private _image: CloudinaryImage
  public get image() {
    return this._image
  }
  private _location: string
  public get location() {
    return this._location
  }
  private _address: string
  public get address() {
    return this._address
  }
  private _openingHours: string
  public get openingHours() {
    return this._openingHours
  }
  public getModel() {
    return this.model
  }

  translate(language: Language) {
    this._location =
      this.model.location[language] || this.model.location.english
    this._address =
      this.model.address[language] || this.model.address.english || ''
    this._openingHours =
      this.model.openingHours[language] || this.model.openingHours.english || ''
  }
}
