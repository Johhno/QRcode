import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisiePage } from './saisie.page';

describe('SaisiePage', () => {
  let component: SaisiePage;
  let fixture: ComponentFixture<SaisiePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaisiePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisiePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
