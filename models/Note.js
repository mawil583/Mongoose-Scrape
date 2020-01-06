var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    note: {
        type: String,
        unique: true
    }
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;