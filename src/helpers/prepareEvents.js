// Preparar eventos en ambito de fechas compatibles en el frontend
import moment from 'moment'

export const prepareEvents = (events = []) => {

	return events.map(
		(e) => ({
			...e,
			// Mandando la fecha de finalización y genera con .toDate()
			end: moment(e.end).toDate(),
			start: moment(e.start).toDate()
		})
	)
}