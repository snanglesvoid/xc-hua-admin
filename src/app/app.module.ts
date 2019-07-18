import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FrontPageImagesComponent } from './components/pages/front-page-images/front-page-images.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/pages/home/home.component'
import { SlideListComponent } from './components/pages/front-page-images/slide-list/slide-list.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { HttpClientModule } from '@angular/common/http'
import { ContentPaneComponent } from './components/content-pane/content-pane.component'
import { SlidePreviewComponent } from './components/pages/front-page-images/slide-preview/slide-preview.component'
import { SmartImageComponent } from './components/common/smart-image/smart-image.component'
import { DeviceDetectorModule } from 'ngx-device-detector'
import { SlideDetailComponent } from './components/pages/front-page-images/slide-detail/slide-detail.component';
import { LanguageSelectComponent } from './components/common/language-select/language-select.component';
import { ImageUploadComponent } from './components/common/image-upload/image-upload.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { ProgressBarComponent } from './components/common/progress-bar/progress-bar.component'

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'front-page-images',
    component: FrontPageImagesComponent,
  },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FrontPageImagesComponent,
    SidebarComponent,
    SlideListComponent,
    ContentPaneComponent,
    SlidePreviewComponent,
    SmartImageComponent,
    SlideDetailComponent,
    LanguageSelectComponent,
    ImageUploadComponent,
    FileSizePipe,
    ProgressBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    BrowserAnimationsModule,
    HttpClientModule,
    DragDropModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
