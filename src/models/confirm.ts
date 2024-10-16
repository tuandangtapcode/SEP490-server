import mongoose from "mongoose"
import Subject from "./subject"
const Schema = mongoose.Schema

const ConfirmSchema = new Schema({
    Student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    Teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    Subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subjects',
        required: true
    },
    TotalFee: {
        type: Number,
        required: true
    },
    LearnType: {
        type: Number,
        required: true
    },
    Address: {
        type: String
    },
    Schedules: {
        type: [
            {
                DateAt: { type: String },
                StartTime: { type: Date },
                EndTime: { type: Date }
            }
        ],
        default: []
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    IsActivate: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
}
)

const Confirm = mongoose.model("Confirm", ConfirmSchema)

export default Confirm