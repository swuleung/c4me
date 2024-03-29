
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env]; // eslint-disable-line import/no-dynamic-require
const db = {};

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        logging: false,
        ...config,
    });
} else if (process.env.NODE_ENV === 'local') {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        ...config,
    });
} else {
    sequelize = new Sequelize({
        logging: false,
        ...config,
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(`${__dirname}/../assets/ca-cert_1.pem`),
            },
        },
    });
}

fs
    .readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
