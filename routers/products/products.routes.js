const { Router } = require("express");
const router = Router();
const ProductManager = require("../../manager/manajers");
const manager = new ProductManager("products.json");

router.get("/", async (req, res) => {
  const products = await manager.getItems();
  const limit = Number(req.query.limit);

  if (isNaN(limit)) {
    res.json({
      status: "success",
      data: products,
    });
  } else if (limit) {
    const limitProducts = products.slice(0, limit);
    res.json({
      status: "success",
      data: limitProducts,
    });
  }
});

router.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const data = await manager.getItemById(pid);

  if (isNaN(pid)) {
    res.status(400).send("el id debe ser un numero");
  }

  if (data) {
    res.json({
      status: "success",
      data: data,
    });
  } else {
    res.status(400).send("invalid data");
  }
});

router.post("/", async (req, res) => {
  const product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.status ||
    !product.category ||
    !product.stock
  ) {
    res.status(400).send("todos los campos deben ser obligatorios");
  } else {
    res.json({
      status: "succes",
      data: await manager.addProduct(product),
    });
  }
});

router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const fieldsToUpdate = req.body;
  const foundId = fieldsToUpdate.hasOwnProperty("id");
  const data = await manager.updateProduct(pid, fieldsToUpdate);
  console.log(data);

  if (foundId) {
    res.status(400).send("no se puede modificar la propiedad id");
  } else {
    if (data) {
      res.json({
        status: "succes",
        data: data,
      });
    } else {
      res.status(400).send("no se encontro el producto");
    }
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  if (isNaN(pid)) {
    res.status(400).send("el parametro debe ser un numero");
  } else {
    res.json({
      status: "succes",
      data: await manager.deleteProduct(pid),
    });
  }
});

module.exports = router;
