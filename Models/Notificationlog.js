const db = require('../Config/db');

const NotificationLog = {
  create: ({ type, message }) => {
    const sql = 'INSERT INTO notifications (type, message) VALUES (?, ?)';
    db.query(sql, [type, message], (err) => {
      if (err) console.error("DB NotificationLog Error:", err);
    });
  },

  getAll: (callback) => {
    db.query('SELECT * FROM notifications ORDER BY created_at DESC', callback);
  }
};

module.exports = NotificationLog;
