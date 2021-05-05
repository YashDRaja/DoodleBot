const express = require("express");
const router = express.Router();
const tf = require('@tensorflow/tfjs');
//const tfn = require("@tensorflow/tfjs-node");



router.get("/", async (req, res) => {
  //const handler = tfn.io.fileSystem("../model/model.json");
  let curmodel = await tf.loadLayersModel('https://raw.githubusercontent.com/YashDRaja/predictive-whiteboard/main/model/model.json');
  curmodel.predict(tf.zeros([1,28,28,1]));
  const fs = require('fs');
  let class_names = [];
  await fs.readFile('../model/class_names.txt', (err, data) => {
    if (err) throw err;
    const text = data.toString();
    const lst = text.split(/\n/);
    for (var i = 0; i < lst.length - 1; i++) {
      class_names[i] = lst[i].slice(0, -1);
    }
    res.json({model: curmodel, class_names: class_names});
  })

});


module.exports = router;