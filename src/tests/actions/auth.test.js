// Configurar el store de redux | npm install redux-mock-store --save-dev
import configureStore from 'redux-mock-store'
// Thunk para que ejecute las func, de las func asincronas
import thunk from 'redux-thunk'
import Swal from 'sweetalert2'

import '@testing-library/jest-dom'
import { startChecking, startLogin, startRegister } from '../../actions/auth'
import { types } from '../../types/types'

// startRegister correcto
import * as fetchModule from '../../helpers/fetch'

// Mock del Sweet Alert
jest.mock('sweetalert2', () => ({ // Retornamos objeto ({})
	fire: jest.fn()
}))
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const initState = {}
let store = mockStore(initState)

// Mock del localStorage
Storage.prototype.setItem = jest.fn()

// Token para startChecking
let token = ''

describe('Testing en acciones de auth', () => {
	// Reiniciar el store en cada test
	beforeEach(() => {
		store = mockStore(initState)
		jest.clearAllMocks() // Usar siempre en mocks
	})

	test('startLogin correcto', async() => {
		// Contraseña incorrecto
		await store.dispatch(startLogin('aaron@gmail.com', '123456'))
		// Obtenemos el uid y nombre del usuario
		const actions = store.getActions()

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: expect.any(String),
				name: expect.any(String)
			}
		})
		// Cuando graba en el localStorage?
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token', expect.any(String)
		)
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token-init-date', expect.any(Number)
		)

		// Leer valorer del local storage?
		// Para el startChecking
		token = localStorage.setItem.mock.calls[0][1] // func de jest mock
		// console.log(localStorage.setItem.mock.calls[0][1])
	})

	test('startLogin incorrecto', async() => {
		await store.dispatch(startLogin('aaron@gmail.com', '1234567'))
		// Obtenemos el uid del usuario
		let actions = store.getActions()

		// Nada en el state/store
		expect(actions).toEqual([])

		// El Sweet Alert fue llamado
		expect(Swal.fire).toHaveBeenCalledWith(
			'Error',
			'Password incorrecto',
			'error'
		)

		await store.dispatch(startLogin('aaron@gmail2.com', '123456'))
		actions = store.getActions()

		expect(Swal.fire).toHaveBeenCalledWith(
			'Error',
			'El usuario no existe con ese email',
			'error'
		)
	})

	test('startRegister correcto', async() => {
		// Evitar crash por usuario ya existente
		// Simular caso correcto
		fetchModule.fetchSinToken = jest.fn(() => ({
			json() {
				return {
					ok: true,
					uid: '123',
					name: 'david',
					token: 'abc123'
				}
			}
		}))
		await store.dispatch(startRegister('test@test.com', '123456', 'test'))

		const actions = store.getActions()

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: '123',
				name: 'david'
			}
		})

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token', 'abc123'
		)
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token-init-date', expect.any(Number)
		)
	})

	// Desactivar setTimeOut()
	test('startChecking correcto', async() => {
		/* Todos los objetos en js son pasados por referencia,
		por lo tanto Storage.prototype.setItem = jest.fn() sera
		el mismo en todos los test, requerimos de hacer un mock
		completo */
		fetchModule.fetchConToken = jest.fn(() => ({
			json() {
				return {
					ok: true,
					uid: '123',
					name: 'david',
					token: 'abc123'
				}
			}
		}))

		await store.dispatch(startChecking())
		const actions = store.getActions()

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: '123',
				name: 'david'
			}
		})
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token',
			'abc123'
		)
	})
});
