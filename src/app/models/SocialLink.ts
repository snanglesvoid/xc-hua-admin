import { Model } from './Model'
import { ApiService } from '../services/api.service'

export interface SocialLinkModel {
  _id: string
  key: string
  name: string
  icon: string
  url: string
}

export class SocialLink extends Model {
  constructor(api: ApiService, private model: SocialLinkModel) {
    super(api)
  }
  public updateFromModel() {}

  public get id() {
    return this.model._id
  }
  public get key() {
    return this.model.key
  }
  public get name() {
    return this.model.name
  }
  public get icon() {
    return this.model.icon
  }
  public get html() {
    return `<i class="fa ${this.icon}"></i>`
  }
  public get url() {
    return this.model.url
  }
  public getModel() {
    return this.model
  }
}
