import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecompraComponent } from './precompra.component';

describe('PrecompraComponent', () => {
  let component: PrecompraComponent;
  let fixture: ComponentFixture<PrecompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrecompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
