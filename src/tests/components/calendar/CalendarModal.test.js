import '@testing-library/jest-dom'
import React from 'react';
import {mount} from 'enzyme'
import {Provider} from 'react-redux'

// Configurar el store de redux | npm install redux-mock-store --save-dev
import configureStore from 'redux-mock-store'
// Thunk para que ejecute las func, de las func asincronas
import thunk from 'redux-thunk'
import {act} from '@testing-library/react'
import moment from 'moment'
import Swal from 'sweetalert2'

import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventStartUpdated, eventClearActiveEvent, eventStartAddNew } from '../../../actions/events';

// Mock al eventStartUpdated
jest.mock('../../../actions/events', () => ({
	eventStartUpdated: jest.fn(),
	eventStartAddNew: jest.fn(),
	eventClearActiveEvent: jest.fn() // Por que lo pide el test
}))
// Mock al sweetalert2
jest.mock('sweetalert2', () => ({
	fire: jest.fn()
}))

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const now = moment().minutes(0).seconds(0).add(1,'hours')
const nowPlus1 = now.clone().add(1, 'hours')

const initState = {
	calendar: {
		events: [],
		activeEvent: {
			title: 'Hola test',
			notes: 'Notas de test',
			start: now.toDate(),
			end: nowPlus1.toDate()
		}
	},
	auth: {
		uid: '123',
		name: 'Aarón'
	},
	ui: {
		modalOpen: true
	}
}

const store = mockStore(initState)
// Mock del store
store.dispatch = jest.fn()

const wrapper = mount(
	<Provider store={store}>
		<CalendarModal />
	</Provider>
)

describe('Testing en <CalendarModal />', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	test('Debe de mostrar el modal', () => {
		// Modificacion al setupTest.js
		expect(wrapper.find('Modal').prop('isOpen')).toBe(true)
	})

	test('Debe llamar la accion de actualizar y cerrar modal', () => {
		wrapper.find('form').simulate('submit', {
			preventDefault(){}
		})
		// Mock eventStartUpdated
		expect(eventStartUpdated).toHaveBeenCalledWith(initState.calendar.activeEvent)
		expect(eventClearActiveEvent).toHaveBeenCalled()
	})

	test('Debe de mostrar error si falta el titulo', () => {
		wrapper.find('form').simulate('submit', {
			preventDefault(){}
		})
		// El beforeEach limpia el form a estado inicial y el titulo esta vacio
		expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true)
	})

	test('Debe de crear un nuevo evento', () => {
		const initState = {
			calendar: {
				events: [],
				activeEvent: null
			},
			auth: {
				uid: '123',
				name: 'Aarón'
			},
			ui: {
				modalOpen: true
			}
		}

		const store = mockStore(initState)
		// Mock del store
		store.dispatch = jest.fn()

		const wrapper = mount(
			<Provider store={store}>
				<CalendarModal />
			</Provider>
		)

		// Dispar modificación del input
		wrapper.find('input[name="title"]').simulate('change', {
			target: {
				name: 'title',
				value: 'Hola test'
			}
		})
		// Submit del form
		wrapper.find('form').simulate('submit', {
			preventDefault(){}
		})

		expect(eventStartAddNew).toHaveBeenCalledWith({
			end: expect.anything(),
			start: expect.anything(),
			title: 'Hola test',
			notes: ''
		})

		// Lo llama el eventStartAddNew
		expect(eventClearActiveEvent).toHaveBeenCalled()
	})

	test('Debe de validar las fechas', () => {
		wrapper.find('input[name="title"]').simulate('change', {
			target: {
				name: 'title',
				value: 'Hola test'
			}
		})

		const hoy = new Date()
		// act porque engloba setFormValues de React
		act(() => {
			// El segundo DateTimePicker, disparar el evento hoy
			wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy)
		})
		wrapper.find('form').simulate('submit', {
			preventDefault(){}
		})

		expect(Swal.fire).toHaveBeenCalledWith(
			'Error',
			'La fecha fin debe de ser mayor a la fecha inicio',
			'error'
		)
	})
})