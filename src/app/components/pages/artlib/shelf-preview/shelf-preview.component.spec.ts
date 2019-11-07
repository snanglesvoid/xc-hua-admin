import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfPreviewComponent } from './shelf-preview.component';

describe('ShelfPreviewComponent', () => {
  let component: ShelfPreviewComponent;
  let fixture: ComponentFixture<ShelfPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
