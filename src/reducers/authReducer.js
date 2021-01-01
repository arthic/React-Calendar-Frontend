import { types } from "../types/types"

const initialState = {
	checking: true,
	// uid: null,
	// name: null
}

export const authReducer = (state = initialState, action) => {

	switch (action.type) {
		case types.authLogin:
				return {
					...state,
					...action.payload, // TODO el usuario
					checking: false //Porque ya se que lo autentique
				}
		case types.authCheckingFinish:
				return {
					...state,
					checking: false
				}
		case types.authLogout:
			return {
				// Borra todo, solo deja el checking
				checking: false
			}
		default:
			return state
	}
}