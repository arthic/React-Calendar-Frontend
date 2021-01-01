import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

export const PublicRoute = ({
	isAutenticated,
	component: Component,
	// El resto de las propiedades del componente
	...rest
}) => {

	return (
		<Route {...rest}
			component={ (props) => (
				// Muestro si no esta autenticado, si si manda al DashboardRoutes
				(isAutenticated)
				?(<Redirect to="/" />)
				:(<Component {...props} />)
			)}
		/>
	)
}

PublicRoute.propTypes = {
	isAutenticated: PropTypes.bool.isRequired,
	component: PropTypes.func.isRequired
}