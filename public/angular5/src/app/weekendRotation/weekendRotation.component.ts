import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../api.service';
import { Observable } from "rxjs/Observable";
// Calendar Module Imports
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import {
  CalendarEvent
} from 'angular-calendar';

@Component({
  selector: 'app-rotation',
  templateUrl: './weekendRotation.component.html',
  styleUrls: ['./weekendRotation.component.scss']
})

export class WeekendRotationComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  events$: Observable<Array<CalendarEvent[]>>;

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal, private service: ApiService) {}

  getEvents(): void {
    this.events$ = this.service.getWeekendRotations();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnInit() {
    this.getEvents();
  }

}
