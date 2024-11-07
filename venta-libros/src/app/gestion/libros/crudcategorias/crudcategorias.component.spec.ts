import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudcategoriasComponent } from './crudcategorias.component';

describe('CrudcategoriasComponent', () => {
  let component: CrudcategoriasComponent;
  let fixture: ComponentFixture<CrudcategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudcategoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudcategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
