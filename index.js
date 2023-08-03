import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));



const app = express();
const port = 8000;

app.set('view engine', 'ejs');
//create current date on Today Work 
const currentDate = new Date();
const indexDate = currentDate.getDay();
const dayNum = currentDate.getDate();
// Sunday - Saturday : 0 - 6
const dateArray = ["Sunday", "Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday"]
const todayDate = dateArray[indexDate]

const todo_list = [{
  todoId: "1",
  todoTask: "Code",
},
{
  todoId: "2",
  todoTask: "Sleep",
},
{
  todoId: "3",
  todoTask: "Coffee",
}
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//index pages(Today Work page)
app.get('/', function (req, res) {
  res.render('pages/index', {
    dateName: todayDate + ", " + dayNum,
    todoList: todo_list
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

  res.render("pages/index", {
    dateName: todayDate + ", " + dayNum,
    todoList: todo_list
  });
});

app.post('/delete/:id', function (req, res){
  const id = req.params.id
  console.log(id)
  

});


app.listen(3000, (req, res) => {
  console.log("App is running on port 3000");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});