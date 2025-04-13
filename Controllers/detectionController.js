const nsfw = require("nsfwjs");
const tf = require("@tensorflow/tfjs-node");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const DetectionLog = require("../Models/Detectionlog");
const NotificationLog = require("../Models/Notificationlog");
const admin = require("../Middleware/firebase"); // Firebase setup

let model;

// Load model once at app start
(async () => {
  model = await nsfw.load();
  console.log("NSFW model loaded");
})();

const analyzeImage = async (req, res) => {
  try {
    const { imageUrl, contentType = "image", deviceToken = null } = req.body;

    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const image = tf.node.decodeImage(buffer, 3);

    const predictions = await model.classify(image);
    image.dispose();

    const pornPrediction = predictions.find(
      (p) => p.className === "Porn" || p.className === "Sexy"
    );

    const detected = pornPrediction && pornPrediction.probability > 0.7;
    const confidence = pornPrediction ? pornPrediction.probability : 0;

    // Save detection result to DB
    DetectionLog.create(
      { content_type: contentType, detected, confidence },
      async (err) => {
        if (err) {
          console.error("DB Save Error:", err);
          return res.status(500).json({ error: "Database save failed" });
        }

        // 🔔 Send Notification if nudity is detected
        if (detected && deviceToken) {
          const message = {
            notification: {
              title: "🚨 Nudity Detected!",
              body: `Risky content with ${(confidence * 100).toFixed(2)}% confidence.`,
            },
            token: deviceToken,
          };

          try {
            await admin.messaging().send(message);

            // Log notification to DB
            NotificationLog.create(
              {
                type: "Risk Alert",
                message: message.notification.body,
              },
              (logErr) => {
                if (logErr) console.error("Notification log DB error:", logErr);
              }
            );
          } catch (notifyErr) {
            console.error("FCM Error:", notifyErr);
          }
        }

        res.json({
          detected,
          confidence,
          predictions,
        });
      }
    );
  } catch (err) {
    console.error("Detection Error:", err);
    res.status(500).json({ error: "Nudity detection failed" });
  }
};

module.exports = {
  analyzeImage,
};
