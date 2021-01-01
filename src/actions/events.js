import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

// Nuevo evento
export const eventStartAddNew = (event) => {
	return async(dispatch, getState) => {

		// Extraemos del state gracias a thunk
		const {uid, name} = getState().auth

		try {
			const resp = await fetchConToken('events', event, 'POST') // endpoint, payload, metodo
			const body = await resp.json()

			// Grabar en la BD
			if(body.ok) {
				event.id = body.evento.id
				event.user = {
					_id: uid,
					name: name
				}
				dispatch(eventAddNew(event))
			}
		} catch (error) {
			console.log(error);
		}
	}
}

const eventAddNew = (event) => ({
	type: types.eventAddNew,
	payload: event
})

// Evento Activo
export const eventSetActive = (event) => ({
	type: types.eventSetActive,
	payload: event
})
// Limpiar evento activo
export const eventClearActiveEvent = () => ({type: types.eventClearActiveEvent})

// Actualziar evento
export const eventStartUpdated = (event) => {
	return async(dispatch) => {

		try {
			console.log(event)
			const resp = await fetchConToken(`events/${event.id}`, event, 'PUT')
			const body = await resp.json()

			if(body.ok) {
				dispatch(eventUpdated(event))
			} else {
				console.log(body.msg)
				Swal.fire('Error', body.msg, 'error')
			}

		} catch (error) {
			console.log(error);
		}
	}
}

const eventUpdated = (event) => ({
	type: types.eventUpdated,
	payload: event
})

// Borrar evento
export const eventStartDelete = () => {
	return async(dispatch, getState) => {

		// Del store
		const {id} = getState().calendar.activeEvent

		try {
			const resp = await fetchConToken(`events/${id}`, {}, 'DELETE')
			const body = await resp.json()

			if(body.ok) {
				dispatch(eventDeleted())
			} else {
				console.log(body.msg)
				Swal.fire('Error', body.msg, 'error')
			}

		} catch (error) {
			console.log(error);
		}
	}
}
const eventDeleted = () => ({type: types.eventDeleted})

// Cargar eventos
export const eventStartLoading = () => {
	return async(dispatch) => {

		try {
			const resp = await fetchConToken('events')
			const body = await resp.json()

			// Preparar eventos compatibles con frontend "fechas"
			const events = prepareEvents(body.eventos)

			// Establece los eventos en el store
			dispatch(eventLoaded(events))
		} catch (error) {
			console.log(error)
		}
	}
}
const eventLoaded = (events) =>  ({
	type: types.eventLoaded,
	payload: events
})

// Va al actions/auth
export const eventLogout = () => ({type: types.eventLogout})
