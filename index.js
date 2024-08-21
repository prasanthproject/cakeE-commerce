const express = require("express");
const path = require("path");
const cors = require("cors");
const { category, Cake, Cupcake, Bread, CakeSlice } = require("./Mongoose");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "Homepage.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/Cake", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "Cake.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/Bread", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "Bread.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/Cupcake", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "Cupcake.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/Slice", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "Slice.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/addtocart", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "cartPage.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/favorites", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "Favorites.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/category", async (req, res) => {
  try {
    const Categories = await category.find();
    res.send(Categories);
    // console.log(Categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/menuItems", async (req, res) => {
  try {
    const [Cakes, Cupcakes, Breads, CakeSlices] = await Promise.all([Cake.find(), Cupcake.find(), Bread.find(), CakeSlice.find()]);
    res.send({
      Cakes,
      Cupcakes,
      Breads,
      CakeSlices,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/Cakes/:id", async (req, res) => {
  const Cake1 = await Cake.findById(req.params.id);
  // console.log(Cake1);
  if (Cake1) {
    res.json(Cake1);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
app.get("/Breads/:id", async (req, res) => {
  const Bread1 = await Bread.findById(req.params.id);
  // console.log(Cake1);
  if (Bread1) {
    res.json(Bread1);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
app.get("/Cupcakes/:id", async (req, res) => {
  const Cupcake1 = await Cupcake.findById(req.params.id);
  // console.log(Cake1);
  if (Cupcake1) {
    res.json(Cupcake1);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
app.get("/cakeSlices/:id", async (req, res) => {
  const cakeSlice1 = await CakeSlice.findById(req.params.id);
  // console.log(Cake1);
  if (cakeSlice1) {
    res.json(cakeSlice1);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});
app.get("/Cakes/productpage/:id", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "cakeProductPage.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/Breads/productpage/:id", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "breadProductPage.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/Cupcakes/productpage/:id", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "cupcakeProductPage.html"));
  } catch (err) {
    console.log(err);
  }
});
app.get("/cakeSlices/productpage/:id", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public", "sliceProductPage.html"));
  } catch (err) {
    console.log(err);
  }
});
// console.log(Cakes);
app.listen(5000, (err) => {
  if (err) console.log(err);
  console.log("port connected");
});
