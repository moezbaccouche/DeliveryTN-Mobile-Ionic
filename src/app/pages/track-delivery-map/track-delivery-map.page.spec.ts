import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackDeliveryMapPage } from './track-delivery-map.page';

describe('TrackDeliveryMapPage', () => {
  let component: TrackDeliveryMapPage;
  let fixture: ComponentFixture<TrackDeliveryMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackDeliveryMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackDeliveryMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
