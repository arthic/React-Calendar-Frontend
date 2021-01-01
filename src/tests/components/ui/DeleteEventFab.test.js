import '@testing-library/jest-dom'
import React from 'react';
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import {eventStartDelete} from '../../../actions/events'

// Configurar el store de redux | npm install redux-mock-store --save-dev
import configureStore from 'redux-mock-store'
// Thunk para que ejecute las func, de las func asincronas
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const initState = {}
const store = mockStore(initState)
// Mock del store para solo disparar el eventStartDelete, no importa que haga
store.dispatch = jest.fn()

// Mock completo al eventStartDelete
jest.mock('../../../actions/events', () => ({
	eventStartDelete: jest.fn()
}))

const wrapper = mount(
	<Provider store={store}>
		<DeleteEventFab />
	</Provider>
)

describe('Testing en <DeleteEventFab />', () => {
	test('Debe desplegarse el componente correctamente', () => {
		expect(wrapper).toMatchSnapshot()
	})

	test('Debe de llamar eventStartDelete al hacer click', () => {
		wrapper.find('button').prop('onClick')()
		// Mock al eventStartDelete
		expect(eventStartDelete).toHaveBeenCalled()
	})
});
