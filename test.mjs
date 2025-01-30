import mongoose from "mongoose";

const companies = await mongoose.model('companies').find({})
console.log('companies', companies);