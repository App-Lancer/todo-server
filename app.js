const express = require("express");
const bodyParser = require("body-parser");
const db = require("./util/db");

const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");

    next();
});

app.post("/todo", (req, res, next) => {
    var body = req.body;

    if(body.status == undefined){
        body.status ="incomplete";
    }

    if(body.name == null || body.name == undefined){
        res.json({"message" : "name not present"}).status(300);
    }else{
        db.addTodo(body, function(result){
            res.json(result).status(200);
        });
    }
});

app.get("/todo", (req, res, next) => {
    var criteria = req.query.query;

    if(criteria == null || criteria == undefined){
        criteria = "all";
    }

    if(criteria != "all" && criteria != "incomplete" && criteria != "complete"){
        res.json({"message" : "invalid Query"}).status(200);
    }else{
        db.getList(criteria, function(result){
            res.json(result).status(200);
        });
    }
});

app.get("/todo/:todo", (req, res, next) => {

    var todoId = req.params.todo;

    if(todoId.length != 24){
        res.json({"message" : "invalid id"}).status(404);
    }else{
        try{
            db.getTodoItem(todoId, function(result){
                if(result != null && result != undefined){
                    res.json(result).status(200);
                }else{
                    res.json({"message" : "No such record found"}).status(404);
                }
            });
        }catch(err){
            res.json({"message" : "No such record found"}).status(404);
        }
    }
});

app.put("/todo/:todo", (req, res, next) => {

    var todoId = req.params.todo;

    if(todoId.length != 24){
        res.json({"message" : "invalid id"}).status(404);
    }else{
        db.updateItem(todoId, req.body, function(result){
            res.json(result).status(200);
        });
    }

    res.status(200);
});

app.delete("/todo/:todo", (req, res, next) => {

    var todoId = req.params.todo;
    console.log(todoId);
    if(todoId.length != 24){
        res.json({"message" : "invalid id"}).status(404);
    }else{
        db.deleteTodoItem(todoId, function(result){
            res.json({"message" : "record deleted"}).status(200);
        });
    }
    res.status(200);
});

app.post("/reset", (req, res, next) => {
    db.resetTodoList(function(result){
        res.json({"message" : "reset successfull"}).status(200);
    });
});

app.listen(8080, ()=>{
    console.log("Server is running!!!");
})