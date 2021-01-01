import { fetchConToken, fetchSinToken } from '../helpers/fetch'
import { types } from '../types/types'
import Swal from 'sweetalert2'
import { eventLogout } from './events'


export const startLogin = (email, password) => {

	// Gracias a redux-thunk disponemos de dispatch
	return async(dispatch) => {
		// Llamado al endpoint auth, osea el url
		const resp = await fetchSinToken('auth', {email, password}, 'POST')
		const body = await resp.json()

		// ok viene de la personalzacion del backend
		if(body.ok) {
			localStorage.setItem('token', body.token)
			// El token dura 2h, grabamos la fecha exacta en que se creo
			localStorage.setItem('token-init-date', new Date().getTime())

			// En el state
				dispatch( login({
					uid: body.uid,
					name: body.name
				}))
		} else {
			Swal.fire('Error', body.msg, 'error')
		}
	}
}

const login = (user) => ({
	type: types.authLogin,
	payload: user
})

export const startRegister = (email, password, name) => {
	// Gracias a redux-thunk disponemos de dispatch
	return async(dispatch) => {
		// Llamado al endpoint auth, osea el url
		const resp = await fetchSinToken('auth/new', {email, password, name}, 'POST')
		const body = await resp.json()

		// ok viene de la personalzacion del backend
		if(body.ok) {
			localStorage.setItem('token', body.token)
			// El token dura 2h, grabamos la fecha exacta en que se creo
			localStorage.setItem('token-init-date', new Date().getTime())

			// En el state
			dispatch( login({
				uid: body.uid,
				name: body.name
			}))
		} else {
			Swal.fire('Error', body.msg, 'error')
		}
	}
}

export const startChecking = () => {
	return async(dispatch) => {
		// Llamado al endpoint auth, osea el url
		const resp = await fetchConToken('auth/renew') //Por defecto es GET, queda en blanco
		const body = await resp.json()

		// ok viene de la personalzacion del backend
		if(body.ok) {
			localStorage.setItem('token', body.token)
			// El token dura 2h, grabamos la fecha exacta en que se creo
			localStorage.setItem('token-init-date', new Date().getTime())

			// En el state
			// Control de Pantalla de carga Calendar Screen
			setTimeout(() => {
				dispatch( login({
					uid: body.uid,
					name: body.name
				}))
			}, 1800);
		} else {
			// Control de Pantalla de carga Login Screen
			setTimeout(() => {
				dispatch(checkingFinish())
			}, 1800);
		}
	}
}

const checkingFinish = () => ({type: types.authCheckingFinish})

export const startLogout = () => {
	return (dispatch) => {
		localStorage.clear()
		dispatch(eventLogout())
		dispatch(logout())
	}
}

const logout = () => ({type: types.authLogout})