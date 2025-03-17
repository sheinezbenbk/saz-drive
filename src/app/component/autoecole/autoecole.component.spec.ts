import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoecoleComponent } from './autoecole.component';

describe('AutoecoleComponent', () => {
  let component: AutoecoleComponent;
  let fixture: ComponentFixture<AutoecoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoecoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoecoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
