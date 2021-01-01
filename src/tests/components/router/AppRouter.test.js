import '@testing-library/jest-dom'
import React from 'react';
import {mount} from 'enzyme'
import {Provider} from 'react-redux'

// Configurar el store de redux | npm install redux-mock-store --save-dev
import configureStore from 'redux-mock-store'
// Thunk para que ejecute las func, de las func asincronas
import thunk from 'redux-thunk'
import { AppRouter } from '../../../components/router/AppRouter';

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

// Mock del store
// store.dispatch = jest.fn()

// El wrapper va dentro de cada test porque cambia en cada prueba
describe('Testing en <AppRouter />', () => {
	test('Debe de mostrar el espere', () => {
		// Para que muestre el espere...
		const initState = {
			auth: {
				checking: true
			}
		}
		const store = mockStore(initState)
		const wrapper = mount(
			<Provider store={store}>
				<AppRouter />
			</Provider>
		)

		expect(wrapper).toMatchSnapshot()
		expect(wrapper.find('h1').exists()).toBe(true)
	})

	test('Debe de mostrar la ruta publica', () => {
		// Para que muestre el <LoginScreen />
		const initState = {
			auth: {
				checking: false, // Ya cargo
				uid: null // No autenticado
			}
		}
		const store = mockStore(initState)
		const wrapper = mount(
			<Provider store={store}>
				<AppRouter />
			</Provider>
		)

		expect(wrapper).toMatchSnapshot()
		expect(wrapper.find('.login-container').exists()).toBe(true)
	})
	test('Debe de mostrar la ruta privada', () => {
		// // Para que muestre el <CalendarScreen />
		const initState = {
			auth: {
				checking: false, // Ya cargo
				uid: '123', // No autenticado
				name: 'Aarón'
			},
			calendar: {
				events: []
			},
			ui: {
				modalOpen: false
			}
		}
		const store = mockStore(initState)
		const wrapper = mount(
			<Provider store={store}>
				<AppRouter />
			</Provider>
		)

		// Conforme pasen los meses va a fallar, actualizar `u` o comentar
		expect(wrapper).toMatchSnapshot()
		expect(wrapper.find('.calendar-screen').exists()).toBe(true)
	})
});
