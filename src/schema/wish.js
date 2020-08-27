const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt
} = graphql;

//Schema
const wishType = new GraphQLObjectType({
    name: 'Wish',
    description: 'Wish Schema',
    fields: ()=>({
      id: {type:GraphQLID},
      wish:{type: GraphQLString},
      amount:{type: GraphQLInt},
      contributionAmount: {type: GraphQLInt}
    })
  });

module.exports.wishSchema = wishType;