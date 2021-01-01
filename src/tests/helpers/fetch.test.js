const { fetchSinToken, fetchConToken } = require("../../helpers/fetch");

describe('Testing en el helper fetch', () => {

	// Mantenemos el token en el scope global
	let token = ''

	// Pasa gracias a las variables de entorno en testing
	test('fetchSinToken debe funcionar', async() => {

		// Auth - Login
		const resp = await fetchSinToken(
			'auth', //endpoint
			{email: 'aaron@gmail.com', password: '123456'}, //payload
			'POST' //method
		)
		// instanceof es de js
		expect(resp instanceof Response).toBe(true)

		const body = await resp.json()
		expect(body.ok).toBe(true)
		// Mandamos al scope global
		token = body.token
	})
	test('fetchConToken debe funcionar', async() => {

		// Grabamos en el localStorage
		localStorage.setItem('token', token)

		// id debe ser uno valido con mongo, no importa si no existe
		const resp = await fetchConToken(
			'events/5fc4a398e7e7862610b0f43b',
			{},
			'DELETE'
		)
		const body = await resp.json()

		expect(body.msg).toBe('Evento no existe por ese id')
	})
});
