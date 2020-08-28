const graphql = require('graphql');
const eventData = require('./data/event');
const wishData = require('./data/wish');
const userData = require('./data/user');
const {GraphQLSchema,GraphQLObjectType,GraphQLString} = graphql;
const eventType = require('./schema/event');
const wishType = require('./schema/wish');
const userType = require('./schema/user');
var _ = require('lodash');
//Root query
const rootQuery = new GraphQLObjectType({
    name: "Wish_Bucket",
    description: "Starting point of query",
    fields:()=>({
      event: {
        type: eventType.eventSchema,
        args:{id:{type: graphql.GraphQLInt}},
        resolve(parent,args){
          //get and return data from datasource
          return _.find(eventData.data,{id:args.id});
        }
      },
      wish:{
          type: wishType.wishSchema,
          args:{id:{type:graphql.GraphQLInt}},
          resolve(parent,args){  
              return _.find(wishData.data,{id:args.id});
          }
      },
      user:{
        type: userType.userSchema,
        args:{id:{type:graphql.GraphQLInt}},
        resolve(parent,args){
            return _.find(userData.data,{id:args.id});
        }
    }
    })
  });

  
  
  module.exports = new GraphQLSchema({
    query:rootQuery
  })