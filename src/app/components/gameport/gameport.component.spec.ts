import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePortComponent } from './gameport.component';

describe('GameComponent', () => {
  let component: GamePortComponent;
  let fixture: ComponentFixture<GamePortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
