import {React, useState, useEffect} from 'react'
// Big Calendar
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
// Redux
import { useDispatch, useSelector } from 'react-redux';
// Components
import { NavBar } from '../ui/NavBar';
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/es'
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es')

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export const CalendarScreen = () => {

	const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month')

	// Despachar el store
	const dispatch = useDispatch()
	// Leer del store
	const {events, activeEvent} = useSelector(state => state.calendar)
	const {uid} = useSelector(state => state.auth)

	// Obtener eventos del backend
	useEffect(() => {
		dispatch(eventStartLoading())
	}, [dispatch])

	const onDoubleClick = (e) => {
		dispatch(uiOpenModal())
	}
	const onSelectEvent = (e) => {
		dispatch(eventSetActive(e))
	}
	// Al cambiar la vista (mes, semana, dia, agenda) se captura la misma
	const onViewChange = (e) => {
		// Guardar la vista en el state
		setLastView(e)
		localStorage.setItem('lastView', e)
	}

	// Area afuera libre de eventos, permite implementar crear eventos con dobleclick
	// No es necesario recibir el "e"
	const onSelectSlot = () => {
		dispatch(eventClearActiveEvent())
	}

	const eventStyleGetter = (event, start, end, isSelected) => {
		// console.log(event, start, end, isSelected);
		const style = {
			backgroundColor: (uid === event.user._id) ? '#367cf7': '#465660',
			borderRadius: '0px',
			opacity: 0.8,
			// display: (uid === event.user._id) ? 'block': 'none',
			display: 'block',
			color: 'white'
		}
		return {
			style
		}
	}
	return (
		<div className="calendar-screen">
			<NavBar />

			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				messages={messages}
				eventPropGetter={eventStyleGetter}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelectEvent}
				onView={onViewChange}
				// Cuando se selecciona un evento
				onSelectSlot={onSelectSlot}
				selectable={true}
				// useState
				view={lastView}
				components={{
					// No se renderiza el componente, se manda como referencia
					event: CalendarEvent
				}}
				className="animate__animated animate__fadeIn"
			/>
			<AddNewFab />
			{
				(activeEvent) && <DeleteEventFab />
			}
			<CalendarModal />
		</div>
	)
}
