import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  AmbientLight,
  SpotLight,
  HemisphereLight,
  Vector3,
  BoxBufferGeometry,
  Mesh,
  LineBasicMaterial,
  PointLight,
  MeshPhongMaterial,
  LineSegments,
  EdgesGeometry,
  FrontSide,
  Group,
  TextureLoader,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  Color,
  CanvasTexture,
  PCFSoftShadowMap,
  DoubleSide,
  NoBlending,
  PCFShadowMap,
  RectAreaLight,
} from 'three'

import { THREEx } from 'src/app/lib/three-extras/threex.domevents'

import { TweenMax, Expo } from 'gsap'

// import { SVGRenderer } from 'src/app/lib/three-extras/renderers/SVGRenderer'
import { ApiService } from 'src/app/services/api.service'
import { LibArticle, ShelfRow } from 'src/app/models/LibArticle'

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
}

const LINE_MATERIAL = new LineBasicMaterial({ color: 0x888888, linewidth: 2 })
const SURFACE_MATERIAL =
  // new MeshPhongMaterial({
  //   color: 0xffffff,
  //   // side: FrontSide,
  //   shadowSide: FrontSide,
  // })

  new MeshPhongMaterial({
    // color: 0x156289,
    color: 0xffffff,
    emissive: 0x000000,
    specular: 0x111111,
    side: FrontSide,
    flatShading: false,
    shininess: 30,
    blending: NoBlending,
  })

@Component({
  selector: 'app-shelf-preview',
  templateUrl: './shelf-preview.component.html',
  styleUrls: ['./shelf-preview.component.less'],
})
export class ShelfPreviewComponent implements OnInit {
  constructor(private el: ElementRef, private api: ApiService) {}

  ngOnInit() {
    setTimeout(_ => this.setup(), 50)
    ;(window as any).shelf = this
  }

  private setup() {
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    // this.renderer = new SVGRenderer()
    this.renderer.setClearColor(new Color(0xffffff), 1)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.
    // this.renderer.shadowMap.type = PCFSoftShadowMap
    // this.renderer.shadowMap.type = 2

    this.camera = new PerspectiveCamera(75, 1, 0.01, 200)
    this.camera.position.z = 25
    this.camera.position.y = 10
    this.resize()
    // this.setupShelf()
    this.setupLights()
    this.setupEvents()

    this.loader = new TextureLoader()
    setTimeout(_ => this.setupItems(), 25)

    this.el.nativeElement.appendChild(this.renderer.domElement)
    window.requestAnimationFrame(_ => this.animate())
  }
  private wires(geometry, material) {
    let geo = new EdgesGeometry(geometry)
    let wireframe = new LineSegments(geo, material)
    return wireframe
  }
  private setupShelf() {
    this.group = new Group()

    let totalHeight = 0
    this._data.forEach(sr => (totalHeight += sr.height))
    this.totalHeight = totalHeight
    //left board
    this.createBoard(0.5, totalHeight + 0.5, this.depth, -20.27, 0, 0)
    //right board
    this.createBoard(0.5, totalHeight + 0.5, this.depth, 20.27, 0, 0)
    //back board
    this.createBoard(this.shelfWidth, totalHeight + 0.5, 0.5, 0, 0, -3.27)
    //floor
    // this.createBoard(
    //   8 * this.shelfWidth,
    //   0.5,
    //   8 * this.shelfWidth,
    //   0,
    //   -totalHeight / 2 - 1,
    //   0,
    //   false
    // )

    let h = -totalHeight / 2
    this._data.forEach(row => {
      this.createBoard(this.shelfWidth, 0.5, this.depth, 0, h, 0)
      h += row.height
    })
    this.createBoard(this.shelfWidth, 0.5, this.depth, 0, h, 0)
    // for (let i = -2; i < 3; ++i) {
    //   let y = i * this.rowHeight
    //   this.createBoard(this.shelfWidth, 0.5, this.depth, 0, y, 0)
    // }

    this.scene.add(this.group)
  }
  private createBoard(
    w = 40,
    h = 0.5,
    d = 6,
    x = 0,
    y = 0,
    z = 0,
    castShadow = true
  ) {
    let boardGeometry = new BoxBufferGeometry(w, h, d)
    boardGeometry.translate(x, y, z)
    let boardWires = this.wires(boardGeometry, LINE_MATERIAL)
    let board = new Mesh(boardGeometry, SURFACE_MATERIAL)
    board.castShadow = castShadow
    board.receiveShadow = true
    this.group.add(boardWires)
    this.group.add(board)
    return board
  }
  private setupLights() {
    this.ambience = new AmbientLight(this.lightColor, this.ambienceIntensity)

    this.pointlight = new PointLight(0xffffff, 0.8)
    this.pointlight.position.z = 10
    this.pointlight.position.y = 50
    this.pointlight.position.z = 30
    this.pointlight.castShadow = true
    this.pointlight.shadow.radius = 4.0
    this.pointlight.shadow.mapSize.width = 1024
    this.pointlight.shadow.mapSize.height = 1024
    this.pointlight.shadow.bias = 0 //-0.0001

    this.scene.add(this.pointlight)
    this.scene.add(this.ambience)
  }

  items: Mesh[] = []

  private async setupItems() {
    try {
      await this.api.libArticles.waitForData()
      this._data = this.api.libArticles.data
      this.setupShelf()

      let y = -this.totalHeight / 2
      this.data.forEach(row => {
        row.items.forEach(article => {
          let mesh = article.computeMesh(y + 0.25 + article.height / 2)
          this.items.push(mesh)
          this.group.add(mesh)
          this.domEvents.addEventListener(mesh, 'mouseover', event => {
            // console.log('mesh mouseover', event, mesh)
            TweenMax.to(mesh.position, 1, {
              x: article.x * 0.75,
              z: 10,
              ease: Expo.easeOut,
              onUpdate: _ => {},
              onComplete: _ => {
                article.animationState = this.textElement(article, mesh)
              },
            })

            TweenMax.to(mesh.rotation, 1, {
              x: 0,
              y: 0,
              z: 0,
            })
          })
          this.domEvents.addEventListener(mesh, 'mouseout', event => {
            // console.log('mesh mouseout', event, mesh)
            TweenMax.to(mesh.position, 1, {
              x: article.x,
              z: article.z,

              ease: Expo.easeOut,
              onUpdate: _ => {},
              onStart: _ => {
                if (article.animationState) {
                  this.scene.remove(article.animationState)
                }
              },
            })

            TweenMax.to(mesh.rotation, 1, {
              x: article.rotation.x,
              y: article.rotation.y,
              z: article.rotation.z,
            })
          })
          this.domEvents.addEventListener(mesh, 'click', event => {
            console.log('mesh click', event, mesh)
            this.articleSelected.emit(article)
          })
        })
        y += row.height
      })
    } catch (error) {
      console.error(error)
    }
  }

  private textElement(article: LibArticle, mesh: Mesh) {
    console.log('text element', article.title)
    let canvas = this.textCanvas.nativeElement
    let context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#424242'
    context.font = '100px Barlow Condensed'
    // context.font = '30px Arial'
    context.fillText(article.title, 0, 80)
    context.font = '60px Barlow Condensed'
    context.fillText(article.description, 0, 160, 512)
    let material = new MeshLambertMaterial({
      map: new CanvasTexture(this.textCanvas.nativeElement),
      transparent: true,
    })
    let geometry = new PlaneBufferGeometry(article.width, article.height)
    let textMesh = new Mesh(geometry, material)
    textMesh.position.set(
      mesh.position.x,
      mesh.position.y,
      mesh.position.z - 15
    )
    TweenMax.to(textMesh.position, 1, {
      x: mesh.position.x + 0.5 + article.width,
      z: mesh.position.z,
      ease: Expo.easeOut,
    })
    this.scene.add(textMesh)
    return textMesh
  }

  private domEvents: any
  private setupEvents() {
    this.domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement)
  }

  @HostListener('window:resize')
  resize() {
    let el = this.el.nativeElement
    this.width = el.getBoundingClientRect().width
    this.height = el.getBoundingClientRect().height
    this.camera.aspect = this.width / this.height
    this.camera.position.z = (30 * 900) / this.width
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  @HostListener('window:scroll')
  animate() {
    window.requestAnimationFrame(_ => this.animate())
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.camera.position.z += 0.5
      event.preventDefault()
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.camera.position.z -= 0.5
      event.preventDefault()
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.camera.position.y += 1
      event.preventDefault()
    }

    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.camera.position.y -= 1
      event.preventDefault()
    }
  }

  @ViewChild('textCanvas') textCanvas: ElementRef<HTMLCanvasElement>

  private _data: ShelfRow[]
  public get data() {
    return this._data
  }
  public set data(value) {
    this._data = value
    setTimeout(_ => this.setup(), 100)
  }

  private width: number
  private height: number
  private depth: number = 6
  private rowHeight: number = 15
  private shelfWidth: number = 40
  private totalHeight: number = 0
  private itemSize = 10

  private scene: Scene
  private renderer: WebGLRenderer
  private camera: PerspectiveCamera

  private lightColor = 0xffffff
  private ambienceIntensity = 0.8 //0.95
  private ambience: AmbientLight

  private spotlightIntensity = 0.8
  private spotlights: SpotLight[] = []
  private pointlight: PointLight
  private loader: TextureLoader

  private group: Group

  @Output() articleSelected = new EventEmitter<LibArticle>()
}
