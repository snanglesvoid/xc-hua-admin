import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { ShelfRow, LibArticle } from 'src/app/models/LibArticle'
import { Observable, from } from 'rxjs'

@Component({
  selector: 'app-artlib',
  templateUrl: './artlib.component.html',
  styleUrls: ['./artlib.component.less'],
})
export class ArtlibComponent implements OnInit {
  constructor(private api: ApiService) {}

  selectedItem: LibArticle

  ngOnInit() {}
}
