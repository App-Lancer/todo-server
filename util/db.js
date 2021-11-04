var mongodb = require("mongodb");

var MongoClient  = mongodb.MongoClient;

var url = "mongodb://localhost:27017/todo";

function connectDB(callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;

        var dbObj = db.db("todo");

        callback(db, dbObj);
    });
}

function addTodo(todoItem, callback){
    connectDB(function(db, dbObj){
        dbObj.collection("todoitem").insertOne(todoItem, function(err, result){
            if(err) throw err;
            dbObj.collection("todoitem").find({"_id" : mongodb.ObjectId(result.insertedId)}).toArray(function(err, todoItem){
                if(err) throw err;
                callback(todoItem);
                db.close();
            });
        });
    });
}

function getList(criteria, callback){
    connectDB(function(db, dbObj){

        var cri = {"status" : criteria};

        if(criteria == "all"){
            cri = {};
        }

        dbObj.collection("todoitem").find(cri).toArray(function(err, result){
            if(err) throw err;
            callback(result);
            db.close();
        });
    });
}

function resetTodoList(callback){
    connectDB(function(db, dbObj){
        dbObj.collection("todoitem").drop(function(err, success){
            if(err) throw err;

            callback(success);
            db.close();
        })
    });
}

function getTodoItem(todoId, callback){
    connectDB(function(db, dbObj){
        dbObj.collection("todoitem").findOne({"_id" : mongodb.ObjectId(todoId)}, function(err, result){
            if(err) throw err;
            callback(result);
            db.close();
        })
    });
}

function deleteTodoItem(todoId, callback){
    connectDB(function(db, dbObj){
        dbObj.collection("todoitem").deleteOne({"_id" : mongodb.ObjectId(todoId)}, function(err, result){
            if(err) throw err;
            callback(result);
            db.close();
        })
    });
}

function updateItem(todoId, body, callback){
    connectDB(function(db, dbObj){
        dbObj.collection("todoitem").updateOne({"_id" : mongodb.ObjectId(todoId)}, {$set : body}, function(err, result){
            if(err) throw err;
            dbObj.collection("todoitem").findOne({"_id" : mongodb.ObjectId(todoId)}, function(err, result){
                if(err) throw err;
                callback(result);
                db.close();
            });
        });
    })
}

module.exports = {addTodo, getList, resetTodoList, getTodoItem, deleteTodoItem, updateItem};