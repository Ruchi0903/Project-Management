import mongoose from "mongoose";

const client = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
});

const ClientSchema = mongoose.model('ClientSchema', client);

export default ClientSchema;