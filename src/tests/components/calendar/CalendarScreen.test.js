import '@testing-library/jest-dom'
import React from 'react';
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import {messages} from '../../../helpers/calendar-messages-es'
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/events';

// Configurar el store de redux | npm install redux-mock-store --save-dev
import configureStore from 'redux-mock-store'
// Thunk para que ejecute las func, de las func asincronas
import thunk from 'redux-thunk'
import {act} from '@testing-library/react'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const initState = {
	calendar: {
		events: []
	},
	auth: {
		uid: '123',
		name: 'Aarón'
	},
	ui: {
		modalOpen: false
	}
}
const store = mockStore(initState)
// Mock del store para solo disparar el eventStartDelete, no importa que haga
store.dispatch = jest.fn()

// Mock completo al eventSetActive
jest.mock('../../../actions/events', () => ({
	eventSetActive: jest.fn(),
	// Como se llama a toda la libreria para evitar error en el test?
	eventStartLoading: jest.fn()
}))
Storage.prototype.setItem = jest.fn()

const wrapper = mount(
	<Provider store={store}>
		<CalendarScreen />
	</Provider>
)

describe('Testing en <CalendarScreen />', () => {
	test('Desplegarse correctametne', () => {
		expect(wrapper).toMatchSnapshot()
	})

	// Disparar las acciones de Calendar | Código de 3eros
	test('Pruebas con las interacciones del calendar', () => {
		const calendar = wrapper.find('Calendar')
		const calendarMessages = calendar.prop('messages')

		// de helpers/calendar-messages-es
		expect(calendarMessages).toEqual(messages)

		// onDoubleClickEvent
		calendar.prop('onDoubleClickEvent')()
		expect(store.dispatch).toHaveBeenCalledWith(
			// Viene del types/uiOpenModal
			{
				type: types.uiOpenModal
			}
		)

		// onSelectEvent
		calendar.prop('onSelectEvent')({start: 'Hola'})
		// eventSetActive viene del mock
		expect(eventSetActive).toHaveBeenCalledWith({start: 'Hola'})

		// onView
		act(() => {
			calendar.prop('onView')('week')
			expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week')
		})
	})
});
