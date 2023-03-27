const express = require("express");
const app = express();
const exhbs = require("express-handlebars");
const bodyparser = require("body-parser");
const dbo = require("./db");

const ObjectID = dbo.ObjectID;

app.engine(
  "hbs",
  exhbs.engine({ layoutsDir: "views/", defaultLayout: "main", extname: "hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views");
//body parser
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  const cursor = collection.find({});
  let employe = await cursor.toArray();
  let message = "";
  let edit_id, edit_book,delete_id;

//Update Record

  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_book = await collection.findOne({ _id: ObjectID(edit_id) });
  }
  
  //Delete Record
  if (req.query.delete_id) {
    await collection.deleteOne({ _id: ObjectID(req.query.delete_id) });
    return res.redirect('/?status=3');
  }


  switch (req.query.status) {
    case "1":
      message = "Inserted Successfully!";
      break;
    case "2":
      message = "Updated Successfully!";
      break;
    case "3":
      message = "Deleted Successfully!";
      break;
    default:
      break;
  }
  res.render("main", { message, employe, edit_book, edit_id });
});







app.post("/store-book", async (req, res, next) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  let book = { name: req.body.title, author: req.body.author };
  await collection.insertOne(book);
  return res.redirect("/?status=1");
});





app.post("/update-book/:edit_id", async (req, res, next) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  let book = { name: req.body.title, author: req.body.author };
  let edit_id=req.params.edit_id;


  await collection.updateOne({_id:ObjectID(edit_id)},{$set:book});
  return res.redirect("/?status=2");
});

app.listen(8000, () => {
  console.log("Listening to 8000 port");
});
