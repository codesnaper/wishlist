const express = require('express');
var graphqlHTTP = require('express-graphql').graphqlHTTP;
const app = express();
const port = 3000;
const eventSchema = require('./rootQuery');
const mongoDB = require('mongoose');
var cors = require('cors')
app.use(cors())

mongoDB.connect('mongodb+srv://sample_user:sample_user@cluster0.4qql4.mongodb.net/wishList?retryWrites=true&w=majority', { useNewUrlParser: true }).then(function(){
  console.log('Initialization Success for db');
  app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: eventSchema,
  }));
  
  app.get('/', (req, res) => {
    res.send(' <a href="/graphql">Go to Graphql</a>')
  })
  
  app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
  })

}).catch(err=>{
  console.log(err)
})
