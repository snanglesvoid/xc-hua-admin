import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
  ViewChildren,
  Input,
} from '@angular/core'
import * as picaFactory from 'pica'
import { Model, CloudinaryImage } from 'src/app/models'
import { ApiService } from 'src/app/services/api.service'
const pica = picaFactory()

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less'],
})
export class ImageUploadComponent implements OnInit {
  constructor(
    private el: ElementRef<HTMLDivElement>,
    private api: ApiService
  ) {}

  ngOnInit() {
    let el = this.el.nativeElement

    let prevDefault = (e: Event) => {
      console.log('prev default')
      e.preventDefault()
      e.stopPropagation()
    }
    let addClass = _ => el.classList.add('dragover')
    let removeClass = _ => el.classList.remove('dragover')
    el.addEventListener('drag', prevDefault)
    el.addEventListener('dragstart', prevDefault)
    el.addEventListener('dragend', prevDefault)
    el.addEventListener('dragover', prevDefault)
    el.addEventListener('dragenter', prevDefault)
    el.addEventListener('dragleave', prevDefault)
    el.addEventListener('drop', prevDefault)

    el.addEventListener('dragover', addClass)
    el.addEventListener('dragenter', addClass)
    el.addEventListener('dragleave', removeClass)
    el.addEventListener('dragend', removeClass)
    el.addEventListener('drop', removeClass)

    el.addEventListener('drop', (event: DragEvent) => {
      this.fileInput.nativeElement.files = event.dataTransfer.files
      this.imageChosen(event)
    })
  }

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>
  @ViewChild('preview') preview: ElementRef<HTMLDivElement>
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>
  @ViewChild('image') image: ElementRef<HTMLImageElement>
  @ViewChild('box') box: ElementRef<HTMLDivElement>

  @Input() list: string = 'FrontPageImage'
  @Input() path: string = 'image'
  private _model: Model
  @Input()
  public get model() {
    return this._model
  }
  public set model(value) {
    this.image.nativeElement.src = ''
    this.fileInput.nativeElement.files = null
    this.fileInput.nativeElement.value = ''
    this._model = value
    this.info.fileSize = 0
    this.info.imageHeight = 0
    this.info.imageWidth = 0
    this.info.uploadProgress = 0
    console.log('set model on image upload')
  }

  ondrop(event) {}

  loading = false

  info = {
    fileSize: 0,
    imageWidth: 0,
    imageHeight: 0,
    uploadProgress: 0,
  }

  imageChosen(e: Event) {
    console.log(e)
    if (this.fileInput.nativeElement.files.length > 0) {
      this.loading = true
      const reader = new FileReader()
      console.log(this.fileInput.nativeElement.files[0])
      this.info.fileSize = this.fileInput.nativeElement.files[0].size

      reader.onload = (e: ProgressEvent) => {
        console.log(e)
        if (reader.result) {
          this.image.nativeElement.src = reader.result.toString()

          this.image.nativeElement.onload = () => {
            console.log('image loaded', this.image.nativeElement)
            this.info.imageWidth = this.image.nativeElement.naturalWidth
            this.info.imageHeight = this.image.nativeElement.naturalHeight
            this.loading = false
          }
        }
      }

      reader.readAsDataURL(this.fileInput.nativeElement.files[0])
    }
  }

  upload() {
    if (!this.model) return alert('model missing')
    if (!this.fileInput.nativeElement.files.length) return alert('no files')
    this.loading = true
    this.uploadFile(
      'https://galerie-xchua.com/admin/api/cloudinary/upload',
      this.fileInput.nativeElement.files,
      {
        list: this.list,
        id: this.model.id,
        path: this.path,
      }
    )
      .then(response => {
        console.log('upload returned ', response)
        let x = this.model.getModel()
        x[this.path] = response[this.path]
        this.model.updateFromModel()
        this.image.nativeElement.src = ''
        this.fileInput.nativeElement.files = null
        this.fileInput.nativeElement.value = ''
        this.info.fileSize = 0
        this.info.imageHeight = 0
        this.info.imageWidth = 0
        this.info.uploadProgress = 0
        this.loading = false
      })
      .catch(alert)
  }

  uploadFile(url: string, fs: File[] | FileList, body?: any): Promise<any> {
    let file = fs[0]
    this.info.uploadProgress = 0.0

    return new Promise((resolve, reject) => {
      let formData: FormData = new FormData()
      let xhr: XMLHttpRequest = new XMLHttpRequest()

      if (body) {
        Object.keys(body).forEach(k => formData.append(k, body[k]))
      }

      formData.append('upload', file, file.name)

      xhr.onreadystatechange = _ => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response))
          } else {
            reject(JSON.parse(xhr.response))
          }
        }
      }

      xhr.upload.onprogress = event => {
        this.info.uploadProgress = event.loaded / event.total
        console.log('upload progress', this.info.uploadProgress)
      }

      xhr.open('POST', url, true)
      xhr.send(formData)
    })
  }

  isButtonDisabled() {
    return (
      this.fileInput.nativeElement.value == '' ||
      this.fileInput.nativeElement.files == null ||
      this.fileInput.nativeElement.files.length == 0 ||
      this.info.fileSize > 1024 * 1024 * 2
    )
  }
}
