const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = graphql;

//Schema
const eventType = new GraphQLObjectType({
  name: 'Event',
  description: 'Event Schema',
  fields: ()=>({
    id: {type:GraphQLString},
    name:{type: GraphQLString},
    endDate:{type: GraphQLString},
    organiser: {type: GraphQLString}
  })
});

module.exports.eventSchema = eventType;

