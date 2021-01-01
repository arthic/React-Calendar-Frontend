import {React, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	BrowserRouter as Router,
	Redirect,
	Switch
} from 'react-router-dom'

import {startChecking} from '../../actions/auth'

import { LoginScreen } from '../auth/LoginScreen'
import { CalendarScreen } from '../calendar/CalendarScreen'
import { LoadingScreen } from '../ui/LoadingScreen'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

export const AppRouter = () => {
	// Despacho del state
	const dispatch = useDispatch()

	// useEffect porque necesitamos estar siempre pendientes de esto
	useEffect(() => {
		dispatch(startChecking())
		/* No se pone la dependencia de "startChecking"  porque no es
		parte del componente y no habra ningun warning*/
	}, [dispatch])

	// Extraer del store
	const {checking, uid} = useSelector(state => state.auth)

	// Si se esta checando = true
	if(checking) {
		return (
			<LoadingScreen />
		)
	}

	return (
		<Router>
			<div>
				<Switch>
					<PublicRoute
					exact
						path="/login"
						component={LoginScreen}
						// !! Pasamos el string a booleano
						isAutenticated={!!uid}
					/>
					<PrivateRoute
						exact
						path="/"
						component={CalendarScreen}
						isAutenticated={!!uid}
					/>

					<Redirect to="/" />

				</Switch>
			</div>
		</Router>
	)
}

