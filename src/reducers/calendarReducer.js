// import moment from 'moment'
import { types } from '../types/types'

/* Referencia Evento
{
	id: new Date().getTime(),
	title: 'Cumpleaños del Arthic',
	// equialente: new date()
	start: moment().add(1, 'hours').toDate(),
	end: moment().add(2, 'hours').toDate(),
	bgcolor: '#fafafa',
	notes: 'Comprar el pastel',
	user: {
		_id: '123',
		name: 'Aarón'
	}
}
*/
const initialState = {
	events: [],
	activeEvent: null
}

export const calendarReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.eventSetActive:
			return {
				...state,
				activeEvent: action.payload
			}
		case types.eventAddNew:
			return {
				...state,
				// Retornamos los eventos anteriores y el payload a añadir
				events: [
					// ... expred para retornar objetos nuevos y anteriores en objetos
					...state.events,
					action.payload
				]
			}
		case types.eventClearActiveEvent:
			return {
				...state,
				activeEvent: null
			}
		case types.eventUpdated:
			return {
				...state,
				// Buscar el evento | Payloads
				events: state.events.map(
					e => (e.id === action.payload.id) ? action.payload : e
				)
			}
		case types.eventDeleted:
			return {
				...state,
				// Borrar el evento | Payloads
				events: state.events.filter(
					e => (e.id !== state.activeEvent.id)
				),
				activeEvent: null
			}
		case types.eventLoaded:
			return {
				...state,
				// Lo que venga en el act.pay osea todos los eventos
				events: [...action.payload]
			}
		case types.eventLogout:
			return {
				// Retornamos el estado inicial
				...initialState
			}
		default:
			return state
	}
}