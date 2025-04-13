const db = require('../Config/db');

const DetectionLog = {
  create: (logData, callback) => {
    const { content_type, detected, confidence } = logData;
    const sql = 'INSERT INTO detection_logs (content_type, detected, confidence) VALUES (?, ?, ?)';
    db.query(sql, [content_type, detected, confidence], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM detection_logs ORDER BY created_at DESC', callback);
  }
};

module.exports = DetectionLog;
