import { startOfDay, endOfDay } from 'date-fns';
import Appointment from '../models/appointment';
import { Op } from 'sequelize';

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);
    const appointments = await Appointment.findAll({
      where: {
        prodiver_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    return res.json(appointments);
  }
}

export default new AvaliableController();
