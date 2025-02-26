import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEffectivenessComponent } from './type-effectiveness.component';

describe('TypeEffectivenessComponent', () => {
  let component: TypeEffectivenessComponent;
  let fixture: ComponentFixture<TypeEffectivenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeEffectivenessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeEffectivenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
