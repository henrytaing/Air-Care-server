const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
