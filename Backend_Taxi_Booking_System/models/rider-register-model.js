import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [/^[A-Za-z\s]+$/, "Name must contain letters and spaces only",]
    },

    password: {
        type: String,
        required: true,
        select: false,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d+$/, "Phone number must contain digit only"],

    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true,
    },
    
    role: {
        type: String,
        enum: ["rider"],
        default: "rider",
        required: true,
    },
    rating: {
        type: Number,
        match: [/^[0-9]{4}$/, "Rating must be number only"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const Rider = mongoose.model("Rider", schema);