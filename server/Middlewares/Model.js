const tf = require('@tensorflow/tfjs');
const fetch = require('node-fetch');
const tfn = require("@tensorflow/tfjs-node");
const handler = tfn.io.fileSystem("../model/model.json");
let curmodel = await tf.loadLayersModel(handler);
let class_names = [];
fetch('https://raw.githubusercontent.com/zaidalyafeai/zaidalyafeai.github.io/master/sketcher/model2/class_names.txt')
.then((r) => {return r.text()})
.then(text => {
  const lst = text.split(/\n/);
  for (var i = 0; i < lst.length - 1; i++) {
    let symbol = lst[i];
    class_names[i] = symbol;
  }
});

module.exports={
  class_names,
  curmodel
}