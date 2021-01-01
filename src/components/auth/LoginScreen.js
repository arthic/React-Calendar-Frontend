import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { startLogin, startRegister } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';
import { LoadingScreen } from '../ui/LoadingScreen';
import './login.css';

export const LoginScreen = () => {
    // Despachar el state
    const dispatch = useDispatch()
    // Login
    const [formLoginValues, handleLoginInputChange] = useForm({
        lEmail: 'usuario@muestra.com',
        lPassword: 'testing'
    })
    const {lEmail, lPassword} = formLoginValues

    const handleLogin = (e) => {
        e.preventDefault()
        dispatch(startLogin(lEmail, lPassword))
    }

    // Registro
    const [formRegisterValues, handleRegisterInputChange] = useForm({
        rName: '',
        rEmail: '',
        rPassword1: '',
        rPassword2: ''
    })
    const {rName, rEmail, rPassword1, rPassword2} = formRegisterValues

    const handleRegister = (e) => {
        e.preventDefault()

        // Validar contraseñas
        if(rPassword1 !== rPassword2) {
            return Swal.fire('Error', 'Las constraseñas deben de ser iguales', 'error')
        }
        if(rPassword1.length < 6) {
            return Swal.fire('Error', 'La constraseña debe ser mayor a 6 caracteres', 'error')
        }
        if(rName.length < 1) {
            return Swal.fire('Error', 'Nombre de usuario obligatorio', 'error')
        }

        dispatch(startRegister(rEmail, rPassword1, rName))
    }

    // Manejo Pantalla de carga
	const {checking} = useSelector(state => state.auth)
    // Si se esta checando = true
	if(checking) {
        return (
            <LoadingScreen />
		)
    }

    return (
        <div className="container login-container animate__animated animate__fadeIn">
            <div className="logo-content">
                <i className="far fa-calendar-alt"></i>
                <h1><strong>Calendar</strong> App</h1>
            </div>
            <div className="row animate__animated animate__fadeInUp">
                <div className="col-md-4 login-form-1">
                    <h3>Ingreso</h3>
                    <form
                        onSubmit={handleLogin}
                    >
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                name="lEmail"
                                value={lEmail}
                                onChange={handleLoginInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="lPassword"
                                value={lPassword}
                                onChange={handleLoginInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Login"
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-4 login-form-2">
                    <h3>Registro</h3>
                    <form
                        onSubmit={handleRegister}
                    >
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="rName"
                                value={rName}
                                onChange={handleRegisterInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                name="rEmail"
                                value={rEmail}
                                onChange={handleRegisterInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="rPassword1"
                                value={rPassword1}
                                onChange={handleRegisterInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita la contraseña"
                                name="rPassword2"
                                value={rPassword2}
                                onChange={handleRegisterInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Crear cuenta" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}