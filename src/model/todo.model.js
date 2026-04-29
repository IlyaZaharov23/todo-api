const { Schema, model } = require("mongoose");

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const todoModel = model("todos", todoSchema);

module.exports = todoModel;
