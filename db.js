const mongo = require("mongoose")

const schema = mongo.Schema;
const objectId = schema.ObjectId;

const user = new schema({
    name: String,
    email: String,
    password: String
})

const todo = new schema({
    title: String,
    done: Boolean,
    userID: objectId
})

const userModel = mongo.model("users", user)
const todoModel = mongo.model('todos', todo)

module.exports = {
    userModel,
    todoModel
}

// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// const User = new Schema({
//   name: String,
//   email: String,
//   password: String
// });

// const Todo = new Schema({
//     userId: ObjectId,
//     title: String,
//     done: Boolean
// });

// const UserModel = mongoose.model('users', User);
// const TodoModel = mongoose.model('todos', Todo);

// module.exports = {
//     UserModel,
//     TodoModel
// }