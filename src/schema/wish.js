const graphql = require('graphql');
const eventType = require('./event');
const eventData = require('./../data/event');
const userType = require('./user');
const userData = require('./../data/user');
const userContData = require('./../data/userCont');
const userContSchema = require('./userContribution');
var _ = require('lodash');
const userContributionModal = require('../model/userContributionModal');


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
      event:{
        type: eventType.eventSchema,
        resolve(parent, args){
          return _.find(eventData.data,{id: parent.eventId});
        }
      },
      participant:{
        type: new graphql.GraphQLList(userContSchema.userContributionSchema),
        resolve(parent,args){
          return  userContributionModal.find({wishId:parent.id}).then(data=>data).catch(err=> err);
        },
      },
    })
  });

module.exports.wishSchema = wishType;