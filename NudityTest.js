const nsfw = require("nsfwjs");
const tf = require("@tensorflow/tfjs-node");
const fetch = require("node-fetch");

async function testNudity(imageUrl) {
  const model = await nsfw.load(); // Load NSFW model
  const response = await fetch(imageUrl);
  const buffer = await response.buffer();
  const image = tf.node.decodeImage(buffer, 3);

  const predictions = await model.classify(image);
  image.dispose();

  console.log("Predictions:", predictions);
}

testNudity("https://thebureaufashionweek.com/wp-content/uploads/2021/08/What-to-wear-to-Fashion-Week.jpg");
