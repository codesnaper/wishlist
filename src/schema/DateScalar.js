const graphql = require('graphql');

const scalarGraphQLDate = {
    date: new graphql.GraphQLScalarType({
        name: "date",
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
        },
    })
}

module.exports.date = scalarGraphQLDate;