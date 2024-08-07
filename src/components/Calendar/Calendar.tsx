import { EventApi, EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import React from 'react'

import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

type View = 'day' | 'month' | 'week'

export interface CalendarProps {
  view: View
  views: View[]
  events: EventInput[]
  disabled?: boolean
  onDateClick?: (date: Date, allDay: boolean) => void
  onDateRangeSelected?: (startDate: Date, endDate: Date, allDay: boolean) => void
  onEventClick?: (event: EventInput) => void
  onPrevClick?: () => void
  onNextClick?: () => void
  onTodayClick?: () => void
}

const viewToCalendarViewMap = {
  month: 'dayGridMonth',
  week: 'timeGridWeek',
  day: 'timeGridDay',
}

const getEventFromFullCalendarEventApi = (e: EventApi): EventInput => ({
  id: e.id,
  start: e.start || new Date(), // Provide a default value if start is null
  end: e.end || new Date(), // Provide a default value if end is null
  title: e.title,
  allDay: e.allDay,
})

const getCalendarViewFromViewProp = (view: View) => (viewToCalendarViewMap as any)[view]

const getViewsFromViewsProp = (views: View[]) => {
  let viewsString = ''
  views.forEach((view) => {
    viewsString += `${getCalendarViewFromViewProp(view)},`
  })

  return viewsString.slice(0, viewsString.length - 1)
}

const Calendar = (props: CalendarProps) => {
  const {
    view,
    views,
    events,
    disabled,
    onDateClick,
    onDateRangeSelected,
    onEventClick,
    onPrevClick,
    onNextClick,
    onTodayClick,
  } = props
  const fullCalendarRef = React.createRef<FullCalendar>()

  const onNavClick = (to: 'prev' | 'next' | 'today') => {
    const calendar = fullCalendarRef?.current?.getApi()
    if (!calendar) {
      return
    }

    const toCalls = {
      prev: {
        nav: () => calendar.prev(),
        callback: onPrevClick,
      },
      next: {
        nav: () => calendar.next(),
        callback: onNextClick,
      },
      today: {
        nav: () => calendar.today(),
        callback: onTodayClick,
      },
    }

    const { nav, callback } = toCalls[to]
    nav()
    if (callback) {
      callback()
    }
  }

  return (
    <FullCalendar
      events={events}
      ref={fullCalendarRef}
      selectable={!disabled}
      customButtons={{
        customPrev: {
          text: 'previous',
          icon: 'chevron-left',
          click: () => onNavClick('prev'),
        },
        customNext: {
          text: 'next',
          icon: 'chevron-right',
          click: () => onNavClick('next'),
        },
        customToday: {
          text: 'today',
          click: () => onNavClick('today'),
        },
      }}
      headerToolbar={{
        left: 'customPrev,customNext customToday',
        center: 'title',
        right: getViewsFromViewsProp(views),
      }}
      initialView={getCalendarViewFromViewProp(view)}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      themeSystem="bootstrap"
      dateClick={(arg) => {
        if (onDateClick) {
          onDateClick(arg.date, arg.allDay)
        }
      }}
      select={(arg) => {
        if (onDateRangeSelected) {
          onDateRangeSelected(arg.start, arg.end, arg.allDay)
        }
      }}
      eventClick={(arg) => {
        if (onEventClick) {
          onEventClick(getEventFromFullCalendarEventApi(arg.event))
        }
      }}
    />
  )
}

Calendar.defaultProps = {
  view: 'week',
  events: [],
  views: ['day', 'week', 'month'],
  onPrevClick: () => undefined,
  onNextClick: () => undefined,
  onTodayClick: () => undefined,
}

export { Calendar }
