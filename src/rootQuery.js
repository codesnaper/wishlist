const graphql = require('graphql');
const mondodb = require('mongoose');
const eventData = require('./data/event');
const wishData = require('./data/wish');
const userData = require('./data/user');
const {GraphQLSchema,GraphQLObjectType,GraphQLString} = graphql;
const eventType = require('./schema/event');
const wishType = require('./schema/wish');
const userType = require('./schema/user');
const graphQLDateTime  =  require('graphql-iso-date')
var _ = require('lodash');
const eventModel = require('./model/eventModel');
const wishModel = require('./model/wishModel');
const userModel = require('./model/userModal');
const participantModel = require("./model/userContributionModal");
const { userContributionSchema } = require('./schema/userContribution');
const userContributionModal = require('./model/userContributionModal');
const userModal = require('./model/userModal');
//Root query
const rootQuery = new GraphQLObjectType({
    name: "Wish_Bucket",
    description: "Starting point of query",
    fields:()=>({
      eventall: {
        type: graphql.GraphQLList(eventType.eventSchema),
        description:"Get all event using user id",
        resolve(_parent,_args){
          return eventModel.find();
        }
      },
      eventUserId:{
        type:new graphql.GraphQLList(eventType.eventSchema),
        args:{userId:{type:GraphQLString}},
        resolve(parent,args){
          return eventModel.find({organiserid:args.userId}).then(data=>data).catch(err=> err);
        }
      },
      event: {
        type: eventType.eventSchema,
        args:{id:{type: graphql.GraphQLString}},
        resolve(_parent,args){
          //get and return data from datasource
          return eventModel.findById(new mondodb.Types.ObjectId(args.id)).then(data=>data).catch(err=> err);
        }
      },
      wish:{
          type: wishType.wishSchema,
          args:{id:{type:graphql.GraphQLInt}},
          resolve(_parent,args){  
              return _.find(wishData.data,{id:args.id});
          }
      },
      user:{
        type: userType.userSchema,
        args:{id:{type:graphql.GraphQLString}},
        resolve(_parent,args){
            return _.find(userData.data,{id:args.id});
        }
    }
    })
  });

  const Mutation = new GraphQLObjectType({
    name: "mutation",
    description:"Changing data",
    fields: {
      createEvent: {
        type: eventType.eventSchema,
        description: "Used for creating event",
        args: {
          name: {
            type: GraphQLString,
          },
          endDate: {
            type: graphQLDateTime.GraphQLDateTime,
          },
          organiserid: {
            type: graphql.GraphQLString,
          },
          code:{
            type: graphql.GraphQLInt,
          }
 
        },
        resolve(_parent,args){
          let event = new eventModel({
            name: args.name,
            endDate: args.endDate,
            organiserid: args.organiserid,
            code: args.code
          });
          event.save().then(()=>console.log('Data saved')).catch(err=>{console.log('Failed saving data'+err)})
          return event;
        }
      },
      updateEvent: {
        type: eventType.eventSchema,
        description:"Updating event",
        args: {
          _id:{type: graphql.GraphQLID},
          name: {
            type: GraphQLString,
          },
          endDate: {
            type: graphQLDateTime.GraphQLDateTime,
          },
          organiserid: {
            type: graphql.GraphQLString,
          },
          code:{
            type: graphql.GraphQLInt,
          }
 
        },
        resolve(_parent,args){
           return eventModel.findByIdAndUpdate( new mondodb.Types.ObjectId(args._id),
           {
            name: args.name,
            endDate: args.endDate,
            organiserid: args.organiserid,
            code: args.code
           }
           ).then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while updating data in db')});
        }
      },
      deleteEvent: {
        type: eventType.eventSchema,
        description: "Delete event based on id",
        args: {
          _id:{type: graphql.GraphQLID},
        },
        resolve(_parent,args){
           return eventModel.deleteOne({_id: new mondodb.Types.ObjectId(args._id)})
          .then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while deleting data in db')});
        }
      },
      createWish: {
        type: wishType.wishSchema,
        description:"Used for creating wish",
        args:{
          wish:{
            type: GraphQLString,
            description:"Wish name",
          },
          amount:{
            type: graphql.GraphQLInt,
            description:"Amount required to fulfill the wish",
          },
          eventId:{
            type: graphql.GraphQLString,
            description:"Event id wish is related to",
          }
        },
        resolve(_parent,args){
          let wish = new wishModel({
            wish: args.wish,
            amount: args.amount,
            eventId: args.eventId,
          });
          return eventModel.findById(new mondodb.Types.ObjectId(args.eventId))
          .then(data => {
            if(data == null){
              throw new Error('Wish cannot be created as event id not exists in system.');
            } else{
              wish.save().then(data=> {return data}).catch(err=>{throw new Error(err)});
            }            
          }).catch(err=>{
            console.error(err);
            throw new Error(err);
          });

        }
      },
      updateWish: {
        type: wishType.wishSchema,
        description:"Used for updating the wish wrt wish id",
        args:{
          _id:{
            type: graphql.GraphQLID,
          },
          wish:{
            type: GraphQLString,
          },
          amount:{
            type: graphql.GraphQLInt,
          },
          eventId:{
            type: graphql.GraphQLString,
          }
        },
        resolve(_parent,args){
          
          eventModel.findById(new mondodb.Types.ObjectId(args.eventId))
          .then(data=>{
            if(data == null){
              throw new Error('Invalid event id, event is expired or not present in system.');
            } else{
              wishModel.findByIdAndUpdate( new mondodb.Types.ObjectId(args._id),
                {
                  wish: args.wish,
                  amount: args.amount,
                  eventId: args.eventId,
                }
                )
                .then(data=>{
                  if(data == null){
                    throw new Error('Wish is expired. Not able to update in system');
                  }
                })
            }
          })
          
        }
      },
      deleteWish: {
        type: wishType.wishSchema,
        args:{
          _id:{
            type: graphql.GraphQLID,
          },
        },
        resolve(_parent,args){
          return wishModel.deleteOne({_id: new mondodb.Types.ObjectId(args._id)})
          .then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while deleting data in db')});
        }
      },
      createUser:{
        type: userType.userSchema,
        args:{
          name: {type: GraphQLString},
          contact: {type: GraphQLString},
          email:{type: GraphQLString},
          password:{type: GraphQLString},
          isExternal: {type: graphql.GraphQLBoolean}
        },
        resolve(_parent,args){
          let user = new userModal({
            name: args.name,
            contact: args.contact,
            email: args.email,
            password: args.password,
            isExternal: args.isExternal,
          });
          user.save().then(()=>console.log('Data saved')).catch(err=>{console.log('Failed saving data'+err)});
          return user;
        }
      },
      editUser:{
        type: userType.userSchema,
        args:{
          id:{
            type: graphql.GraphQLID,
          },
          name: {type: GraphQLString},
          contact: {type: GraphQLString},
          email:{type: GraphQLString},
          password:{type: GraphQLString},
          isExternal: {type: graphql.GraphQLBoolean}
        },
        resolve(_parent,args){
          return userModel.findByIdAndUpdate( new mondodb.Types.ObjectId(args._id),
           {
            name: args.name,
            contact: args.contact,
            email: args.email,
            password: args.password,
            isExternal: args.isExternal,
           }
           ).then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while updating data in db')});
        }
      },
      deleteUser:{
        type: userType.userSchema,
        args:{
          id:{
            type: graphql.GraphQLID,
          }
        },
        resolve(_parent,args){
          return userModel.deleteOne({_id: new mondodb.Types.ObjectId(args._id)})
          .then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while deleting data in db')});
        }
      },
      createParticipant:{
        type: userContributionSchema,
        args:{
          userId: {type: GraphQLString},
          wishId: {type: GraphQLString},
          amount: {type: graphql.GraphQLInt},
        },
        resolve(_parent,args){
          let participant = new userContributionModal({
            userId: args.userId,
            wishId: args.wishId,
            amount: args.amount, 
          });
          participant.save().then(()=>console.log('Data saved')).catch(err=>{console.log('Failed saving data'+err)});
          return participant;
        }
      },
      editParticipant:{
        type: userContributionSchema,
        args:{
          id:{type: graphql.GraphQLID},
          userId: {type: graphql.GraphQLInt},
          amount: {type: graphql.GraphQLInt},
        },
        resolve(_parent,args){
          return participantModel.findByIdAndUpdate( new mondodb.Types.ObjectId(args._id),
           {
            userId: args.userId,
            wishId: args.wishId,
            amount: args.amount, 
           }
           ).then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while updating data in db')});
        }
      },
      deleteParticipant:{
        type: userContributionSchema,
        args:{
          id:{type: graphql.GraphQLID},
        },
        resolve(parent,args){
          return participantModel.deleteOne({_id: new mondodb.Types.ObjectId(args._id)})
          .then(data=>{return data}).catch(err=>{console.log(err);throw new Error('error while deleting data in db')});
        }
      }
    }
  });
  
  
  module.exports = new GraphQLSchema({
    query:rootQuery,
    mutation: Mutation,
  })