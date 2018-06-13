import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from "rxjs/Subject";
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
  CalendarEvent,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-rotation',
  templateUrl: './weekendRotation.component.html',
  styleUrls: ['./weekendRotation.component.scss']
})

export class WeekendRotationComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

<<<<<<< HEAD
  modalData: {
    action: string;
    event: CalendarEvent;
  };
=======
  getWeek(): Observable<object>{
    this.service.getWeek()
    .subscribe(week => {
      if(week.status != 200){
        alert("error finding week");
      }
      else{
        this.week = week.body;
        this.showtable = true;
      }
    })
>>>>>>> develop

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: subDays(startOfDay(new Date()), 1),
      title: 'Wilson Acuna'
    },
    {
      start: addHours(startOfDay(new Date()), 10),
      end: addHours(startOfDay(new Date()), 12),
      title: 'Andres Bejarano'
    }
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal) {}

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

  eventTimesChanged({
      event,
      newStart,
      newEnd
    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnInit() {}

}
