const graphql = require('graphql');
const userType = require('./user');
const userData = require('./../data/user');
var _ = require('lodash');
const wishData = require('./../data/wish');
const wishSchema= require('./wish');

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
    id: {type:GraphQLInt},
    userId: {type: GraphQLInt},
    wishId: {type: GraphQLInt},
    amount: {type: GraphQLInt},
    user: {
      type: new graphql.GraphQLList(userType.userSchema),
      resolve(parent,args){
        return _.filter(userData.data,{id: parent.userId});
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

