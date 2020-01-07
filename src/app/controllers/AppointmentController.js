import * as Yup from 'yup';
import {
  startOfHour, parseISO, isBefore, format,
} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Appointment from '../models/appointment';
import User from '../models/user';
import File from '../models/file';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.sttus(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;
    /* Verifica se é provedor de serviços pelo id */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!checkIsProvider) {
      return res.status(401).json({ error: 'Povider not valid' });
    }

    /** Verifica se a data é maior que a de hoje */

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    /** Checa disponibilidade de horário */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date not avaliable' });
    }

    /** Passando as verificações, cria-se o agendamento */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    /** Notifica prestador de serviço */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt },
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
