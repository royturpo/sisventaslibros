import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudprovedoresComponent } from './crudprovedores.component';

describe('CrudprovedoresComponent', () => {
  let component: CrudprovedoresComponent;
  let fixture: ComponentFixture<CrudprovedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudprovedoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudprovedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
