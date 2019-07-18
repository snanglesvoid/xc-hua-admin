import { Injectable, EventEmitter } from '@angular/core'

export type Language = 'english' | 'german' | 'chinese'

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {
    ;(window as any).languageService = this
  }

  private _lang: Language = 'english'
  public languageChanged = new EventEmitter<Language>()
  public get language() {
    return this._lang
  }
  public set language(value: Language) {
    this._lang = value
    this.languageChanged.emit(value)
  }
}
