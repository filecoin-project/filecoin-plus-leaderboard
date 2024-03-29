import type { NextApiRequest, NextApiResponse } from 'next';
import { gql, ApolloServer } from 'apollo-server-micro';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginSchemaReporting,
  ApolloServerPluginUsageReporting,
} from 'apollo-server-core';
import neo4j from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';
import Cors from 'cors';
import { typeDefs } from '../../graphql/typeDefs';
import { InterPlanetaryOneAPI } from '../../graphql/datasources/interplanetaryOne';
import { resolvers } from '../../graphql/resolvers';
import { VerifiersAPI } from '../../graphql/datasources/verifiers';

// Declare here to handle cold start of serverless function
let startServer: any;
let apolloServer: any;

const driver = neo4j.driver(
  // @ts-ignore
  process.env.NEO4J_URI,
  // @ts-ignore
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export interface NextContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    next(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// cold start, need to create ApolloServer
const neoSchema = new Neo4jGraphQL({ typeDefs, resolvers, driver });
// Uncomment to create any indexes or constraints defined in GraphQL type definitions
const schema = await neoSchema.getSchema();
await neoSchema.assertIndexesAndConstraints({ options: { create: true } });
apolloServer = new ApolloServer({
  schema,
  introspection: true,
  dataSources: () => ({
    interplanetaryOneAPI: new InterPlanetaryOneAPI(),
    verifiersAPI: new VerifiersAPI(),
  }),
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      footer: false,
    }),
    ApolloServerPluginSchemaReporting(),
    ApolloServerPluginUsageReporting({
      sendVariableValues: { all: true },
      sendHeaders: { all: true },
      sendReportsImmediately: true,
    }),
  ],
});

await apolloServer.start();
const createHandler = apolloServer.createHandler({
  path: '/api/graphql',
});

// Initialize the cors middleware
const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  // methods: ['GET', 'POST', 'OPTIONS'],
  origin: [/http.*$/],
  credentials: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  await runMiddleware(req, res, createHandler);
}
