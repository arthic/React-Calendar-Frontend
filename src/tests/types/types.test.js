const { types } = require("../../types/types");

describe('Testing en Types', () => {
	test('Los types deben ser iguales', () => {
		expect(types).toEqual({

			uiOpenModal: '[ui] Open modal',
			uiCloseModal: '[ui] Close modal',


			eventSetActive: '[event] Set Active',
			eventLogout: '[event] Logout event',

			eventStartAddNew: '[event] Start add new',
			eventAddNew: '[event] Add new',
			eventClearActiveEvent: '[event] Clear active event',
			eventUpdated: '[event] Event updated',
			eventDeleted: '[event] Event deleted',
			eventLoaded: '[event] Events loaded',


			authCheckingFinish: '[auth] Finish cheking login state',
			authStartLogin: '[auth] Start login',
			authLogin: '[auth] Login',
			authStartRegister: '[auth] Start Register',
			authStartTokenRenew: '[auth] Start token renew',
			authLogout: '[auth] Logout',
		})
	})
	
});
