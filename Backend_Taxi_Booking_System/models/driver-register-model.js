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
        match: [/^[0-9]{10}$/, "Phone number must contain digit only",]

    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true,
    },
    role: {
        type: String,
        enum: ["driver"],
        default: "driver",
        required: true,
    },

    carType: {
         type: String,
        enum: ["Sedan", "UV", "Hatchback"],
        required: true,
    },
    carNumber: {
        type : String,
        required: true,
        match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, "Car Number must contain letters and digit only"],

    },

    aadharCardNumber: {
        type : String,
        required: true,
        match:  [/^[0-9]{12}$/, "Car Number must contain letters and digit only"],
    },

    licenseCardNumber: {
        type : String,
        required: true,
        match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, "License Card Number must conatin only number"]
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

export const Driver = mongoose.model("Driver", schema);