import {React, useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Modal from 'react-modal';
import moment from 'moment'
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2'
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdated } from '../../actions/events';

const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)'
	}
};

// Para que pase el test de <AppRouter />
if (process.env.NODE_ENV !== 'test') {
	// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
	Modal.setAppElement('#root')
}

const now = moment().minutes(0).seconds(0).add(1,'hours')
const nowPlus1 = now.clone().add(1, 'hours')

const initEvent = {
	title: '',
	notes: '',
	start: now.toDate(),
	end: nowPlus1.toDate()
}

export const CalendarModal = () => {

	// Escuchar el state, desestructuramos porque necesiamos el "modalOpen"
	const {modalOpen} = useSelector(state => state.ui)
	const {activeEvent} = useSelector(state => state.calendar)

	// Despachar el state
	const dispatch = useDispatch()

	const [dateStart, setDateStart] = useState(now.toDate())
	const [dateEnd, setDateEnd] = useState(nowPlus1.toDate())
	const [titleValid, setTitleValid] = useState(true)

	// Formulario
	const [formValues, setFormValues] = useState(initEvent)
	const {notes, title, start, end} = formValues

	// Manejar los campos al desplegar modal en el evento correspondiente
	useEffect(() => {
		// si "activeEvent" existe | no es null
		if (activeEvent) {
			// Desplegar los campos en el modal
			setFormValues(activeEvent)
			setDateStart(activeEvent.start)
			setDateEnd(activeEvent.end)
			// Limpiar inputs del modal cuando se borre un evento
		} else {
			// Si esta null se establecen los valores por defecto
			setFormValues(initEvent)
		}
	}, [activeEvent, setFormValues]);

	const handleInputChange = ({target}) => {
		setFormValues({
			...formValues,
			[target.name]: target.value
		})
	}

	// Modal
	const closeModal = () => {
		dispatch(uiCloseModal())
		dispatch(eventClearActiveEvent())
		setFormValues(initEvent)
	}

	const handleStartDateChange = (e) => {
		setDateStart(e)
		setFormValues({
			...formValues,
			start: e
		})
	}
	const handleEndDateChange = (e) => {
		setDateEnd(e)
		setFormValues({
			...formValues,
			end: e
		})
	}

	const handleSubmitForm = (e) => {
		e.preventDefault()

		const momentStart = moment(start)
		const momentEnd = moment(end)

		// Manejo de fechas
		if (momentStart.isSameOrAfter(momentEnd)) {
			return Swal.fire('Error','La fecha fin debe de ser mayor a la fecha inicio', 'error')
		}

		// Manejo de título
		if (title.trim().length < 2) {
			return setTitleValid(false)
		}

		// Manejo si se agrega nuevo evento o se actualiza uno existente
		if (activeEvent) {
			dispatch(eventStartUpdated(formValues))
		} else {
			dispatch(eventStartAddNew(formValues))
		}

		setTitleValid(true)
		closeModal()
	}


	return (
		<Modal
			isOpen={modalOpen}
			// onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={customStyles}
			closeTimeoutMS={200}
			className="modal"
			overlayClassName="modal-fondo"
			// Testing en <CalendarModal />
			ariaHideApp={!process.env.NODE_ENV === 'test'}
        >
			<h1> { (activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
			<hr />
			<form
				className="container"
				onSubmit={handleSubmitForm}
			>

				<div className="form-group">
					<label>Fecha y hora inicio</label>
					<DateTimePicker
						onChange={handleStartDateChange}
						value={dateStart}
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label>Fecha y hora fin</label>
					<DateTimePicker
						onChange={handleEndDateChange}
						value={dateEnd}
						minDate={dateStart}
						className="form-control"
					/>
				</div>

				<hr />
				<div className="form-group">
					<label>Titulo y notas</label>
					<input
						type="text"
						// Si el titulo no es valido, despliega la clase
						className={`form-control ${ !titleValid && 'is-invalid'}`}
						placeholder="Título del evento"
						name="title"
						autoComplete="off"
						value={title}
						onChange={handleInputChange}
					/>
					<small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
				</div>

				<div className="form-group">
					<textarea
						type="text"
						className="form-control"
						placeholder="Notas"
						rows="5"
						name="notes"
						value={notes}
						onChange={handleInputChange}
					></textarea>
					<small id="emailHelp" className="form-text text-muted">Información adicional</small>
				</div>

				<button
					type="submit"
					className="btn btn-outline-primary btn-block"
				>
					<i className="far fa-save"></i>
					<span> Guardar</span>
				</button>

			</form>
		</Modal>
	)
}
