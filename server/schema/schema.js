import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

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
});

const schema = new GraphQLSchema({
    query: RootQuery,
});

export default schema;