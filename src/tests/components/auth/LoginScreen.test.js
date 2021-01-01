import '@testing-library/jest-dom'
import React from 'react';
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';
import Swal from 'sweetalert2';

// Configurar el store de redux | npm install redux-mock-store --save-dev
import configureStore from 'redux-mock-store'
// Thunk para que ejecute las func, de las func asincronas
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const initState = {
	auth: {
		checking: false, // Ya cargo
		uid: null // No autenticado
	}
}
const store = mockStore(initState)
// Mock del store
store.dispatch = jest.fn()

// Mock al startLogin
jest.mock('../../../actions/auth', () => ({
	startLogin: jest.fn(),
	startRegister: jest.fn()
}))
// Mock del Sweet Alert
jest.mock('sweetalert2', () => ({
	fire: jest.fn()
}))

const wrapper = mount(
	<Provider store={store}>
		<LoginScreen />
	</Provider>
)

describe('Testing en <LoginScreen />', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Debe desplegarse correctamente', () => {
		expect(wrapper).toMatchSnapshot()
	})

	test('Debe llamar el dispatch del login', () => {
		wrapper.find('input[name="lEmail"]').simulate('change', {
			target: {
				name: 'lEmail',
				value: 'test@testing.com'
			}
		})
		wrapper.find('input[name="lPassword"]').simulate('change', {
			target: {
				name: 'lPassword',
				value: 't3st1ng'
			}
		})

		// at(0) encuentre la primera posición porque hay 2 form
		wrapper.find('form').at(0).prop('onSubmit')({
			preventDefault(){}
		})
		expect(startLogin).toHaveBeenCalledWith(
			'test@testing.com',
			't3st1ng'
		)
	})

	test('No hay registro si las contraseñas son diferentes', () => {
		wrapper.find('input[name="rPassword1"]').simulate('change', {
			target: {
				name: 'rPassword1',
				value: 't3st1ng'
			}
		})
		wrapper.find('input[name="rPassword2"]').simulate('change', {
			target: {
				name: 'rPassword2',
				value: 'testing'
			}
		})
		// 2° form (1)
		wrapper.find('form').at(1).prop('onSubmit')({
			preventDefault(){}
		})
		// No llamar a la accion startRegister
		expect(startRegister).not.toHaveBeenCalled()
		expect(Swal.fire).toHaveBeenCalledWith(
			'Error',
			'Las constraseñas deben de ser iguales',
			'error'
		)
	})

	test('Debe dispararse el registro con constraseñas iguales', () => {
		wrapper.find('input[name="rName"]').simulate('change', {
			target: {
				name: 'rName',
				value: 'tester'
			}
		})
		wrapper.find('input[name="rEmail"]').simulate('change', {
			target: {
				name: 'rEmail',
				value: 'tester@testing.com'
			}
		})
		wrapper.find('input[name="rPassword1"]').simulate('change', {
			target: {
				name: 'rPassword1',
				value: 't3st1ng'
			}
		})
		wrapper.find('input[name="rPassword2"]').simulate('change', {
			target: {
				name: 'rPassword2',
				value: 't3st1ng'
			}
		})
		// 2° form (1)
		wrapper.find('form').at(1).prop('onSubmit')({
			preventDefault(){}
		})

		// Invertidos
		expect(Swal.fire).not.toHaveBeenCalled()
		expect(startRegister).toHaveBeenCalledWith(
			'tester@testing.com',
			't3st1ng',
			'tester'
		)
	})
})


