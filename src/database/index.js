import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/user';
import File from '../app/models/file';

const models = [User, File];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // eslint-disable-next-line prettier/prettier
    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
