import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const {
      host, port, secure, auth,
    } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      /** Há alguns servidores de email que não precisam
       * de autenticação, por isso verificamos a existencia de
       * um usuário.
       */
      auth: auth.user ? auth : null,
    });
    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

  sendMail(message) {
    return this.transporter.sendMail({
      /** Desestrutura-se as configurações incluindo a mensagem */
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
