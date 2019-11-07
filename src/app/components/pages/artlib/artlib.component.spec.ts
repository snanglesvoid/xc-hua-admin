import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtlibComponent } from './artlib.component';

describe('ArtlibComponent', () => {
  let component: ArtlibComponent;
  let fixture: ComponentFixture<ArtlibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtlibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtlibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
