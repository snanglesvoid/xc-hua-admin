import { Language } from '../services/language.service'
import { ApiService } from '../services/api.service'

export abstract class Model {
  constructor(protected api: ApiService) {}
  private _language: Language
  public translate(language: Language) {
    this._language = language
  }
  public abstract get id()
  public populate(field: string): Promise<any> {
    return Promise.resolve('Nothing to populate')
  }

  public abstract getModel()
  public abstract updateFromModel()

  public animationState: any
}

export interface Name {
  first: string
  last: string
}
