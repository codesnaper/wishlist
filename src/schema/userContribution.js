const graphql = require('graphql');
const userType = require('./user');
const userData = require('./../data/user');
var _ = require('lodash');
const wishData = require('./../data/wish');
const wishSchema= require('./wish');
const userModal = require('../model/userModal');
const mongodb = require('mongoose');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = graphql;

//Schema
const userContType = new GraphQLObjectType({
  name: 'UserContribution',
  description: 'User Contribution Schema',
  fields: ()=>({
    id: {type:GraphQLID},
    userId: {type: GraphQLString},
    wishId: {type: GraphQLString},
    amount: {type: GraphQLInt},
    user: {
      type: userType.userSchema,
      resolve(parent,args){
        return userModal.findById(new mongodb.Types.ObjectId(parent.userId)).then(data=>data).catch(err=> err);
      }
    },
    wish:{
      type: new graphql.GraphQLList(wishSchema.wishSchema),
      resolve(parent,args){
        return _.filter(wishData.data,{id:o=parent.wishId});
      }
    }
  })
});

module.exports.userContributionSchema = userContType;

