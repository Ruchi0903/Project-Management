import mongoose from "mongoose";


export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "mgmt_graphql",
    })
        .then(() => {
            const conn = mongoose.connection;
            console.log(`DB Connected: ${conn.host}`.cyan.underline.bold);
        })
        .catch((e) => {
            console.log(e);
        });
};
