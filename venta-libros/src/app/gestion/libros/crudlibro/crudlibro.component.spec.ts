import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudlibroComponent } from './crudlibro.component';

describe('CrudlibroComponent', () => {
  let component: CrudlibroComponent;
  let fixture: ComponentFixture<CrudlibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudlibroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudlibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
