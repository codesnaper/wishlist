const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = graphql;

//Schema
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'User Schema',
  fields: ()=>({
    id: {type:GraphQLInt},
    name:{type: GraphQLString},
    contact:{type: GraphQLString},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    isExternal: {type: graphql.GraphQLBoolean},
  })
});

module.exports.userSchema = userType;

