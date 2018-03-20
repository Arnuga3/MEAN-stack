import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleFieldComponent } from './battlefield.component';

describe('BattleFieldComponent', () => {
  let component: BattleFieldComponent;
  let fixture: ComponentFixture<BattleFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
