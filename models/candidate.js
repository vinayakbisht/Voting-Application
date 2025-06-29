
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    party: {
        type: String,
        rerquired: true,
    },  
    age: {
        type: Number,
        required: true,
    },
    votes: [                  // array of objects
        {                     // each object
            user:{
                type: mongoose.Schema.Types.ObjectId,          // object id provided by mongoose for document of User model
                ref: "User", 
                required: true           
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
  
})

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;