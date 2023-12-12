import mongoose from "mongoose";

const project = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientSchema',
    }
});

const ProjectSchema = mongoose.model('ProjectSchema', project);

export default ProjectSchema;