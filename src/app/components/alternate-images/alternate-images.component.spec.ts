import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateImagesComponent } from './alternate-images.component';

describe('AlternateImagesComponent', () => {
  let component: AlternateImagesComponent;
  let fixture: ComponentFixture<AlternateImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlternateImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlternateImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
