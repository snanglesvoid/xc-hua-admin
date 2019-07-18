import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPageImagesComponent } from './front-page-images.component';

describe('FrontPageImagesComponent', () => {
  let component: FrontPageImagesComponent;
  let fixture: ComponentFixture<FrontPageImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPageImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPageImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
