const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudySearchSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String},
    challenges: {type: [String]},
    tags: {type: [String]},
    author: { type: String},
    userID:{type: String},
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},

    competences: {type: [String]},
    lang: {type: String},
    levels: {type: [String]},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
StudySearchSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

StudySearchSchema.index({name:'text', description: 'text', tags: 'text',competences: 'text',  levels: 'text' ,challenges: 'text', author: 'text' ,  lang: 'text'},
                        {default_language: "spanish" })

const myDB = mongoose.connection.useDb('neuronegame');
const StudySearch = myDB.model('StudySearch', StudySearchSchema);

module.exports = StudySearch;