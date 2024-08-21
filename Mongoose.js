const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/Cake", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => {
    console.log("failed Connected", err);
  });

const categorySchema = new mongoose.Schema({
  img: {
    type: String,
  },
  title: {
    type: String,
  },
});
const category = mongoose.model("categories", categorySchema);

const CakeSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  flavour: {
    type: [String],
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  recipe: {
    type: String,
  },
});
const Cake = new mongoose.model("cakes", CakeSchema);
const CupcakeSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  flavour: {
    type: [String],
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  recipe: {
    type: String,
  },
});
const Cupcake = mongoose.model("cupcakes", CupcakeSchema);

const BreadSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  recipe: {
    type: String,
  },
});

const Bread = mongoose.model("breads", BreadSchema);
const CakeSliceSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  type: {
    type: String,
  },
  flavour: {
    type: [String],
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  recipe: {
    type: String,
  },
});
const CakeSlice = mongoose.model("cakeSlices", CakeSliceSchema);
module.exports = { category, Cake, Cupcake, Bread, CakeSlice };

// index.js
