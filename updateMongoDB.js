// npm install express
var express = require("express");
var app = express(); // Contenedor de Endpoints o WS Restful
const { MongoClient } = require("mongodb");
var client = 0;

var dbName = "";
var collectionName = "";

// Referencias a la base y colección
var database = 0;
var collection = 0;

// Middleware para interpretar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function prepareDB() {
  dbName = "myDatabase";
  collectionName = "recipes";

  // Crear referencias
  database = client.db(dbName);
  collection = database.collection(collectionName);
}

async function connectDB() {
  const uri =
    "mongodb+srv://lopezolverarafael9_db_user:nE8eFPkhz6cBmMfY@cluster0.lcuwlsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  client = new MongoClient(uri);
  await client.connect();
}

// =

app.get("/", async function (request, response) {
  r = { message: "Nothing to send" };
  response.json(r);
});

app.get("/serv001", async function (req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.query.geo;

  r = {
    user_id: user_id,
    token: token,
    geo: geo,
  };

  res.json(r);
});

app.get("/serv0010", async function (req, res) {
  const user_id1 = req.query.id;
  const token1 = req.query.token;
  const geo1 = req.query.geo;

  r1 = {
    user_id: user_id1,
    token: token1,
    geo: geo1,
  };

  res.json(r1);
});

app.post("/serv002", async function (req, res) {
  const user_id = req.body.id;
  const token = req.body.token;
  const geo = req.body.geo;

  r = {
    user_id: user_id,
    token: token,
    geo: geo,
  };

  res.json(r);
});

app.post("/serv003/:info", async function (req, res) {
  const info = req.params.info;
  let r = { info: info };
  res.json(r);
});




// update
app.put("/receipt/update", async function (req, res) {
  if (!req.body) {
    return res
      .status(400)
      .json({ result: "Error: No se recibió body en la petición." });
  }

  const recipeName = req.body.name;
  const newIngredients = req.body.ingredients;
  const newPrepTime = req.body.prepTimeInMinutes;

  if (!recipeName) {
    return res
      .status(400)
      .json({ result: "Error: Falta el campo 'name' para actualizar." });
  }

  let result = "";

  try {
    const updateResult = await collection.updateOne(
      { name: recipeName }, // filtro
      {
        $set: {
          ingredients: newIngredients,
          prepTimeInMinutes: newPrepTime,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      result = `No se encontró ninguna receta con el nombre "${recipeName}".`;
    } else if (updateResult.modifiedCount === 0) {
      result = `La receta "${recipeName}" ya estaba actualizada.`;
    } else {
      result = `Receta "${recipeName}" actualizada correctamente.`;
    }
  } catch (err) {
    console.error(`Error al actualizar la receta: ${err}`);
    result = `Error al actualizar la receta: ${err}`;
  }

  res.json({ result: result });
});

//
app.listen(3000, function () {
  console.log("Aplicación ejemplo, escuchando el puerto 3000!");
  connectDB();
  prepareDB();
});
