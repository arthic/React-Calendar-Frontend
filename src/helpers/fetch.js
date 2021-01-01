const baseUrl = process.env.REACT_APP_API_URL

const fetchSinToken = (endpoint, data, method = 'GET') => {
	const url = `${baseUrl}/${endpoint}` // http://localhost:4000/api

	// Puente que retornar la petición fetch
	if (method === 'GET') {
		return fetch(url)
	} else {
		return fetch(url, {
			// El metodo que sea
			method,
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}
}

// Va al AppRouter
const fetchConToken = (endpoint, data, method = 'GET') => {
	const url = `${baseUrl}/${endpoint}` // http://localhost:4000/api
	// Leemos el token del localStorage
	const token = localStorage.getItem('token') || '' //Por si hay un null y evitar reventar la app

	// Puente que retornar la petición fetch
	if (method === 'GET') {
		return fetch(url, {
			method,
			// Obtenemos? el token por los headers
			headers: {
				'x-token': token
			}
		})
	} else {
		return fetch(url, {
			// El metodo que sea
			method,
			headers: {
				'Content-type': 'application/json',
				// Mandamos? el token por los headers
				'x-token': token
			},
			body: JSON.stringify(data)
		})
	}
}

export {
	fetchSinToken,
	fetchConToken
}