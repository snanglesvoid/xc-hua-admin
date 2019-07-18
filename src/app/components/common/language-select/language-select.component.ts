import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { LanguageService } from 'src/app/services/language.service'

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.less'],
})
export class LanguageSelectComponent implements OnInit {
  constructor(private lang: LanguageService) {}

  ngOnInit() {}

  setLanguage(value) {
    this.lang.language = value
  }

  view = 'desktop'
  @Output()
  viewChange = new EventEmitter<string>()

  setView(value) {
    this.view = value
    this.viewChange.emit(value)
  }
}
