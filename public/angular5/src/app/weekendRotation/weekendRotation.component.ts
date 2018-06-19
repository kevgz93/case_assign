import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../api.service';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { map } from 'rxjs/operators';
// Calendar Module Imports
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
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

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  events$: Observable<Array<CalendarEvent[]>>;

  activeDayIsOpen: boolean = true;

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
