import type { NextApiRequest, NextApiResponse } from 'next';
import { gql, ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import neo4j from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';
import Cors from 'cors';

// Declare here to handle cold start of serverless function
let startServer: any;
let apolloServer: any;

const typeDefs = gql`
  type Verifier {
    id: ID!
    name: String
    organization: String
    location: String
    addressKey: String
    addressId: String
    averageTtd: Int
    totalApprovals: Int
    githubUsername: String
    githubAvatarUrl: String
    startedAt: String
    hasDatacap: DataCap @relationship(type: "HAS", direction: OUT)
  }

  type DataCap {
    total: Int
    available: Int
    allocated: Int
    usedInDeals: Int
    verifierHas: Verifier @relationship(type: "HAS", direction: IN)
  }
`;

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

// Uncomment to create any indexes or constraints defined in GraphQL type definitions
//await neoSchema.assertIndexesAndConstraints({ options: { create: true } });

// cold start, need to create ApolloServer
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
const schema = await neoSchema.getSchema();
apolloServer = new ApolloServer({
  schema,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

await apolloServer.start();
const createHandler = apolloServer.createHandler({
  path: '/api/graphql',
});

// Initialize the cors middleware
const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  methods: ['GET', 'POST', 'OPTIONS'],
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
