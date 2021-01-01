import { authReducer } from '../../reducers/authReducer'
import { types } from '../../types/types';

const initState = {
	checking: true,
	// uid: null,
	// name: null
}

describe('Testing en authReducer', () => {
	test('Debe retornar el estado por defecto', () => {
		const action = {}
		const state = authReducer(initState, action)

		expect(state).toEqual(initState)
	})

	test('Debe autenticar el usuario', () => {
		// Buscamos la accion en actions/auth.js "login" y compiamos para no exportarl
		const action = {
			type: types.authLogin,
			payload: {
				uid: '123',
				name: 'aaron'
			}
		}
		const state = authReducer(initState, action)

		expect(state).toEqual({
			checking: false,
			uid: '123',
			name: 'aaron'
		})
	})
});
