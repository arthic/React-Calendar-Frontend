const { uiOpenModal, uiCloseModal } = require("../../actions/ui");
const { uiReducer } = require("../../reducers/uiReducer");

const initState = {
	modalOpen: false
}

describe('Testing en uiReducer', () => {
	test('Debe retornar el estado por defecto', () => {
		const state = uiReducer(initState, {})

		expect(state).toEqual(initState)
	})

	test('Debe abrir y cerrar el modal', () => {
		const modalOpen = uiOpenModal()
		const state = uiReducer(initState, modalOpen)
		expect(state).toEqual({modalOpen: true})

		// Caso opuesto
		const modalClose = uiCloseModal()
		// state viene del estado anterior
		const stateClose = uiReducer(state, modalClose)
		// Modal open debe de ser close
		expect(stateClose).toEqual({modalOpen: false})
	})
});
