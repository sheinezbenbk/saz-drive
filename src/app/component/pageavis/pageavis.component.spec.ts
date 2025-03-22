import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageavisComponent } from './pageavis.component';

describe('PageavisComponent', () => {
  let component: PageavisComponent;
  let fixture: ComponentFixture<PageavisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageavisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageavisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
