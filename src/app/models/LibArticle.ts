import { CloudinaryImageModel, CloudinaryImage } from './CloudinaryImage'
import { Model } from './Model'
import { Language } from '../services/language.service'
import { ApiService } from '../services/api.service'
import {
  Mesh,
  TextureLoader,
  NoBlending,
  FrontSide,
  BoxBufferGeometry,
  MeshLambertMaterial,
} from 'three'

export interface LibArticleModel {
  _id: string
  slug: string
  title: { english: string; german?: string; chinese?: string }
  picture: CloudinaryImageModel
  pictures: CloudinaryImageModel[]
  description: { english?: string; chinese?: string; german?: string }
  height: number
  width: number
  depth: number
  x: number
  y: number
  z: number
  rotation: {
    x: number
    y: number
    z: number
  }
}

export interface ShelfRowModel {
  _id: string
  index: number
  height: number
  items: LibArticleModel[]
}

export class LibArticle extends Model {
  constructor(api: ApiService, private model: LibArticleModel) {
    super(api)
    this._picture = new CloudinaryImage(
      api,
      model.picture as CloudinaryImageModel
    )
    this._pictures =
      model.pictures && model.pictures.length
        ? model.pictures.map(p => new CloudinaryImage(api, p))
        : []
  }

  public get id() {
    return this.model._id
  }
  public get slug() {
    return this.model.slug
  }

  private _picture: CloudinaryImage
  public get picture() {
    return this._picture
  }

  private _pictures: CloudinaryImage[]
  public get pictures() {
    return this._pictures
  }

  private _title: string
  public get title() {
    return this._title
  }

  private _description: string
  public get description() {
    return this._description
  }

  public get height() {
    return this.model.height
  }
  public set height(value) {
    this.model.height = value
    this.updateGeometry()
  }
  public get width() {
    return this.model.width
  }
  public set width(value) {
    this.model.width = value
    this.updateGeometry()
  }
  public get depth() {
    return this.model.depth
  }
  public set depth(value) {
    this.model.depth = value
    this.updateGeometry()
  }

  public get x() {
    return this.model.x
  }
  public set x(value) {
    this.model.x = value
    if (this.mesh) {
      this.mesh.position.x = value
    }
  }
  public get y() {
    return this.model.y
  }
  public set y(value) {
    let difference = value - this.model.y
    this.model.y = value
    if (this.mesh) {
      this.mesh.position.y += difference
    }
  }
  public get z() {
    return this.model.z
  }
  public set z(value) {
    this.model.z = value
    if (this.mesh) {
      this.mesh.position.z = value
    }
  }
  public get rotation() {
    return this.model.rotation
  }
  public set rotationX(value) {
    this.model.rotation.x = value
    if (this.mesh) {
      this.mesh.rotation.x = value
    }
  }
  public set rotationY(value) {
    this.model.rotation.y = value
    if (this.mesh) {
      this.mesh.rotation.y = value
    }
  }
  public set rotationZ(value) {
    this.model.rotation.z = value
    if (this.mesh) {
      this.mesh.rotation.z = value
    }
  }
  private updateGeometry() {
    if (this.mesh) {
      this.mesh.geometry = new BoxBufferGeometry(
        this.width,
        this.height,
        this.depth,
        100,
        100
      )
    }
  }
  public getModel() {
    return this.model
  }
  private _mesh?: Mesh
  public get mesh() {
    return this._mesh
  }
  public set mesh(value: Mesh) {
    this._mesh = value
  }
  private yOffset: number = 0
  public computeMesh(yOffset?: number): Mesh {
    yOffset = yOffset || this.yOffset
    this.yOffset = yOffset
    let material = new MeshLambertMaterial({
      map: new TextureLoader().load(this.picture.url),
      blending: NoBlending,
      side: FrontSide,
      transparent: true,
    })
    let geometry = new BoxBufferGeometry(
      this.width,
      this.height,
      this.depth,
      100,
      100
    )
    let mesh = new Mesh(geometry, material)
    mesh.position.set(this.x, this.y + yOffset, this.z)
    mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.mesh = mesh
    return mesh
  }
  public updateFromModel() {
    this._picture = new CloudinaryImage(this.api, this.model
      .picture as CloudinaryImageModel)
    this._pictures =
      this.model.pictures && this.model.pictures.length
        ? this.model.pictures.map(p => new CloudinaryImage(this.api, p))
        : []
  }

  public translate(language: Language) {
    this._title = this.model.title[language] || this.model.title.english
    this._description = this.model.description
      ? this.model.description[language] || this.model.description.english || ''
      : ''
  }
}

export class ShelfRow extends Model {
  constructor(api: ApiService, private model: ShelfRowModel) {
    super(api)
    this._items = this.model.items.map(x => new LibArticle(api, x))
  }

  private _items: LibArticle[]
  public get items() {
    return this._items
  }

  public get id() {
    return this.model._id
  }
  public get height() {
    return this.model.height
  }
  public get index() {
    return this.model.index
  }

  public translate(language: Language) {
    this._items.forEach(x => x.translate(language))
  }

  public getModel() {
    return this.model
  }

  public updateFromModel() {
    this._items.forEach(x => x.updateFromModel())
  }
}
