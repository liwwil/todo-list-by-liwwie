import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8000;


//create current date on Today Work 
const currentDate = new Date();
const indexDate = currentDate.getDay();
const dayNum = currentDate.getDate();
// Sunday - Saturday : 0 - 6
const dateArray = ["Sunday", "Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday"]
const todayDate = dateArray[indexDate]

const todo_list = [];
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/todoListDB", {
  useNewUrlParser: true,
});

//Create Mongoose Schema
const itemTodoSchema = {
  name: String,
}

const Item = mongoose.model('Item', itemTodoSchema);

const item1 = new Item({
  name: "welcome to your todolist!"
})

const item2 = new Item({
  name: "hit add button"
})

const item3 = new Item({
  name: "hit delete button"
})

const defaultItem = [item1, item2, item3];

//index pages(Today Work page)
app.get('/', function (req, res) {

  Item.find({}).then(foundItems => {
    if (Item.length === 0) {
      Item.insertMany(defaultItem)
        .then(function () {
          console.log("Successfully Inserted!");
        })
        .catch(function (err) {
          console.log(err);
        });
      res.redirect("/");
    }else {
      res.render('pages/index', {
        dateName: todayDate + ", " + dayNum,
        newItem: Item
      });
    }
  });
  res.render('pages/index', {
    dateName: todayDate + ", " + dayNum,
    newItem: Item
  });

});

app.post("/", (req, res) => {
  const inputTodoId = todo_list.length + 1;
  const inputTodoTask = req.body.todoTask;

  todo_list.push({
    todoId: inputTodoId,
    todoTask: inputTodoTask
  });

  console.log(todo_list);

  res.redirect("/");
});

function removeTodoListById(id) {
  let arraySize = todo_list.length;
  let indexTmp = 0;
  for (let i = 0; i < arraySize; i++) {
    if (todo_list[i].todoId == id) {
      indexTmp = i;
    }
  }
  todo_list.splice(indexTmp, 1);
  if (todo_list.length < arraySize) return true;
  else return false;
}

app.post('/delete/:id', function (req, res) {
  const id = req.params.id
  console.log(id);
  let removeData = removeTodoListById(id);
  if (removeData) {
    console.log(todo_list);
    res.redirect("/");
  } else {
    throw new Error('Failed delete data');
  }
});




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});