import { Model } from './Model'
import { Artwork } from './Artist'
import { Language } from '../services/language.service'
import { ApiService } from '../services/api.service'

export interface CloudinaryImageModel {
  public_id: string
  format: string
  height: number
  width: number
  version: number
  resource_type: string
  url: string
  secure_url: string
}

export class CloudinaryImage extends Model {
  constructor(api: ApiService, private model?: CloudinaryImageModel) {
    super(api)
  }
  public updateFromModel() {}

  public get id() {
    return this.model ? this.model.public_id : ''
  }
  public get exists() {
    return this.model !== undefined
  }
  public get format() {
    return this.model.format
  }
  public get height() {
    return this.model.height
  }
  public get width() {
    return this.model.width
  }
  public get url() {
    return this.model.secure_url
  }
  public get resourceType() {
    return this.model.resource_type
  }
  public getModel() {
    return this.model
  }

  public caption?: Artwork

  public clone() {
    let clone = new CloudinaryImage(this.api, this.model)
    return clone
  }

  public limit(width, height) {
    return `https://res.cloudinary.com/xc-hua/image/upload/c_limit,h_${height},w_${width}/${
      this.id
    }`
  }

  translate(language: Language) {}
}
