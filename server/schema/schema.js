import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import ProjectSchema from "../models/Project.js";
import ClientSchema from "../models/Client.js";

// CLIENT
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
});

// PROJECT
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },

        // shows relationship b/w different datas (b/w client and proj here.)
        // client is a child of project, so use parent.clientId and clientId is present inside the project data in sampleData.js
        client: {
            type: ClientType,
            resolve(parent, args) {
                return ClientSchema.findById(parent.clientId);
            }
        }
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return ProjectSchema.find();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ProjectSchema.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return ClientSchema.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ClientSchema.findById(args.id);
            }
        }
    },
});


// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add a client from the mongoose db (visible on compass)
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const client = new ClientSchema({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });

                return client.save();
            }
        },

        // Delete a Client from the mongoose db (visible on compass)
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                // Find and delete projs associated with the client
                ProjectSchema.find({ clientId: args.id }).then((projects) => {
                    projects.forEach((project) => {
                        ProjectSchema.findOneAndDelete({ _id: project._id })
                            .then(() => console.log(`Project ${project._id} deleted`))
                            .catch((err) => console.log(`Error deleting project ${project._id}:  ${err}`))

                    })
                })
                return ClientSchema.findOneAndDelete({ _id: args.id })
                    .then((deletedClient) => {
                        if (!deletedClient) {
                            throw new Error(`Client with ID ${args.id} not found`);
                        }
                        console.log(`Client ${deletedClient._id} deleted`);
                        return deletedClient;
                    })
                    .catch((err) => {
                        console.error(`Error deleting client ${args.id}: ${err}`)
                        throw err;
                    });
            },
        },

        // deleteClient: {
        //     type: ClientType,
        //     args: {
        //         id: { type: GraphQLNonNull(GraphQLID) },
        //     },
        //     resolve(parent, args) {
        //         return ClientSchema.findOneAndDelete({ _id: args.id })
        //     },
        // },

        // Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' },
                        }
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new ProjectSchema({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });

                return project.save();
            },
        },
        // Delete a project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return ProjectSchema.findOneAndDelete({ _id: args.id })
            },
        },
        // Update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatusUpdate",
                        values: {
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' },
                        },
                    }),
                },
            },
            resolve(parent, args) {
                return ProjectSchema.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    // if the project asked is not there, it'll create it.
                    { new: true }
                );
            }
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});

export default schema;

// 1:08:55 he got the error bcz of clients, we got it right. no worry, start it from here.