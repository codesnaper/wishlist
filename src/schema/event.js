const graphql = require('graphql');
const wishData = require('./../data/wish');
const wishSchema= require('./wish');
const userType = require('./user');
const userData = require('./../data/user');
var _ = require('lodash');

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
    id: {type:GraphQLID},
    name:{type: GraphQLString},
    endDate:{type: GraphQLString},
    wish:{
      type: new graphql.GraphQLList(wishSchema.wishSchema),
      resolve(parent,args){
        return _.filter(wishData.data,{eventId:parent.id});
      }
    },
    organizer:{
      type: userType.userSchema,
      resolve(parent,args){
        return _.find(userData.data,{id:parent.organiserid});
      }
    }
  })
});

module.exports.eventSchema = eventType;

