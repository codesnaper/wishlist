const graphql = require('graphql');
const wishData = require('./../data/wish');
const wishSchema= require('./wish');
const userType = require('./user');
const userData = require('./../data/user');
var _ = require('lodash');
const wishModel = require('../model/wishModel');
const mongodb = require('mongoose');
const userModal = require('../model/userModal');

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
    _id: {type:GraphQLID},
    name:{type: new graphql.GraphQLNonNull(GraphQLString)},
    endDate:{type: GraphQLString},
    code:{type:GraphQLInt},
    organiserid:{type: GraphQLString},
    wish:{
      type: new graphql.GraphQLList(wishSchema.wishSchema),
      resolve(parent,args){
        return wishModel.find({eventId: parent._id}).then(data=>data).catch(err=> err);
      }
    },
    organizer:{
      type: userType.userSchema,
      resolve(parent,args){
        return userModal.findById(new mongodb.Types.ObjectId(parent.organiserid))
      }
    }
  })
});

module.exports.eventSchema = eventType;

