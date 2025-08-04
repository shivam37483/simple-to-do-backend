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
