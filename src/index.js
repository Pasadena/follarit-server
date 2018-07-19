const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');
const axios = require('axios');

const apiUrl = 'http://data.foli.fi/citybike/';

const resolvers = {
  Query: {
    data: () => axios.get(apiUrl).then(res => {
      const data = res.data;
      return Object.assign({}, data, { racks: Object.values(data.racks)});
    }),
    racks: () => axios.get(apiUrl).then(res => 
      Object.values(res.data.racks)
    ),
    rack: (parent, args) => {
      const { id } = args;
      axios.get(apiUrl).then(res => res.data.racks[id]);
    }
  }
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers
});

server.start(() => console.log(`Server is running on localhost:4000`)); 