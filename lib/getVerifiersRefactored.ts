import * as util from 'util';
import {
  addHttpsIfNotLocal,
  getAverageTtd,
  isAddressId,
  isAddressKey,
  normalizeVerifiers,
  trimAndClean,
} from '../utils/general';
import * as cheerio from 'cheerio';
import markdownIt from 'markdown-it';
import { Octokit } from 'octokit';
import {
  IssueComment,
  IssueCommentConnection,
  IssueConnection,
  PullRequest,
  PullRequestCommit,
  PullRequestCommitConnection,
  PullRequestConnection,
  Repository,
} from '@octokit/graphql-schema';
import {
  getAddress,
  getName,
  getApprovedAddress,
  getOrganization,
  getRegion,
  getWebsiteAndSocial,
} from '../utils/regexes';
import { getAddressIdFromKey } from './getAddressIdFromKey';
import { getAddressKeyFromId } from './getAddressKeyFromId';
import _ from 'lodash';
import { extractedFromGithub } from '../mocks/extractedFromGithub';
import { getVerifiersWithoutAllowanceArray } from '../mocks/getVerifiersWithoutAllowanceArray';
import { getVerifiersWithAllowanceArray } from '../mocks/getVerifiersWithAllowanceArray';
import { getIssues } from './getIssues';
import { getVerifiersFromIssues } from './getVerifiersFromIssues';
import verifier from './verifier';

util.inspect.defaultOptions = {
  colors: true,
  depth: 6,
  maxArrayLength: null,
  // showHidden: true,
  // breakLength: Infinity,
  breakLength: 2,
};

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

// const getIssue = async (issueNumber: number) => {
//   const QUERY = `
//     query ($owner: String!, $repo: String!, $issueNumber: Int!) {
//       repository(owner: $owner, name: $repo) {
//         issue(number: $issueNumber) {
//           number
//           title
//           body
//           comments(first: 100) {
//             edges {
//               node {
//                 body
//               }
//             }
//           }
//         }
//       }
//     }
//   `;
//   const response = await octokit.graphql<{ repository: Repository }>(QUERY, {
//     owner: 'filecoin-project',
//     repo: 'notary-governance',
//     issueNumber,
//   });

//   return {
//     ...response.repository.issue,
//     comments: response.repository.issue?.comments.edges?.flatMap((v) => v?.node),
//   };
// };

// const getIssues = async (num: number = 100) => {
//   const QUERY = `
//     query ($owner: String!, $repo: String!, $after: String, $num: Int = 100) {
//       repository(owner:$owner, name:$repo) {
//         issues(first:$num, after:$after, orderBy: {field: CREATED_AT, direction: ASC}) {
//           pageInfo {
//             startCursor
//             endCursor
//             hasNextPage
//           }
//           edges {
//             cursor
//             node {
//               number
//               title
//               body
//               comments(first: 100) {
//                 edges {
//                   node {
//                     body
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `;
//   const response = await octokit.graphql<{ repository: Repository }>(QUERY, {
//     owner: 'filecoin-project',
//     repo: 'notary-governance',
//     num,
//   });

//   return response.repository.issues.edges?.map((v) => ({
//     ...v?.node,
//     comments: v?.node?.comments.edges?.flatMap((v) => v?.node),
//     response,
//   }));
// };

const filterPossibleVerifiers = async (list: any) => {
  const newList = await list;
  // console.log('filterPossibleVerifiers().newList ->', newList);
  return newList.filter((v: {}) => Object.entries(v).filter((n) => n[1]).length > 3);
};

const filterExistsInInterplanetaryApi = (verifiers: any[]) => {
  const verifiersFromIpo = getVerifiersWithoutAllowanceArray;
  return verifiers.filter((verifier) =>
    verifiersFromIpo.data.find((fromIpo) => {
      const issueFromAuditTrail = /([0-9]+)$/im.exec(fromIpo.auditTrail) || [];
      return (
        verifier.addressId === fromIpo.addressId ||
        verifier.addressKey === fromIpo.address ||
        verifier.issueNumber === issueFromAuditTrail[1]
      );
    }),
  );
};

const enrichWithInfoFromInterplanetaryOne = (verifiers: any[]) => {
  // const verifiersFromIpo = getVerifiersWithoutAllowanceArray;
  const verifiersFromIpo = getVerifiersWithAllowanceArray;
  return verifiers.map((verifier) => ({
    ...verifier,
    fromInterplanetaryOneApi: { ...verifiersFromIpo.data.find((fromIpo) => verifier.addressId === fromIpo.addressId) },
    // fromInterplanetaryOneApiByIssueNumber: {
    //   ...verifiersFromIpo.data.find((fromIpo) => {
    //     const issueFromAuditTrail = /([0-9]+)$/im.exec(fromIpo.auditTrail) || [];
    //     return verifier.issueNumber === issueFromAuditTrail[0];
    //   }),
    // },
    // allFromInterplanetaryOneApi: [
    //   ...verifiersFromIpo.data.filter((fromIpo) => verifier.addressId === fromIpo.addressId),
    // ],
  }));
};

// TODO: refactor & remove
export const getVerifiersWithTemporaryEnrichment = async () => {
  // const verifiers = await loadVerifiers();
  // const notariesData = verifiers.data;
  // const notariesData = getVerifiersMock.data;
  // const notariesData = {...await getVerifiers, verifiedClientsCount: 0, initialAllowance: 0, };
  let notariesData = await getVerifiers({ enrichedBy: 'INTERPLANETARY_ONE' });
  notariesData = _.orderBy(notariesData, ['issueNumber'], ['desc']);
  notariesData = _.uniqBy(notariesData, 'addressId');
  // console.log('notariesData ->', notariesData);
  notariesData = notariesData.map((v) => ({
    ...v,
    verifiedClientsCount: v.fromInterplanetaryOneApi.verifiedClientsCount || 0,
    initialAllowance: v.fromInterplanetaryOneApi.initialAllowance || 0,
    allowance: v.fromInterplanetaryOneApi.allowance || 0,
    allowanceArray: v.fromInterplanetaryOneApi.allowanceArray || [],
    auditTrail: v.fromInterplanetaryOneApi.auditTrail || null,
  }));
  // console.log('notariesData ->', notariesData);

  const orderVerifiers = (verifiers) =>
    _.orderBy(notariesData, ['verifiedClientsCount', 'initialAllowance'], ['desc', 'desc']);
  let notaries = orderVerifiers(notariesData);

  notaries = await Promise.all(
    notaries.map(async (notary) => {
      const verifiedClients = await verifier.getVerifiedClients(notary.addressId);
      const verifiedClientsData = verifiedClients?.data || [];
      // console.log('verifiedClientsData.length ->', verifiedClientsData.length);
      const addressId = notary.addressId || (notary.address && (await getAddressIdFromKey(notary.address))) || null;
      const addressKey = notary.address || (notary.addressId && (await getAddressKeyFromId(notary.addressId))) || null;

      const removeInvalidTimestamps = (verifier: any) =>
        verifier
          .filter((v: any) => !!v.createMessageTimestamp)
          .filter((v: any) => !!v.issueCreateTimestamp)
          .filter((v: any) => v.createMessageTimestamp > v.issueCreateTimestamp)
          .filter((v: any) => v.addressId != notary.addressId);

      const secondsToDatacapForEveryClient = removeInvalidTimestamps(verifiedClientsData).map((v: any) => {
        return v.createMessageTimestamp - v.issueCreateTimestamp;
      });

      return {
        ...notary,
        addressId,
        addressKey,
        ttdAverages: getAverageTtd(secondsToDatacapForEveryClient),
      };
    }),
  );

  return notaries;
};

export async function getVerifiers(options?: { enrichedBy: string | undefined }) {
  // console.log('allIssues.length ->', allIssues.length);
  // const allIssues = await getIssues(50);

  const verifiersData = await filterPossibleVerifiers(getVerifiersFromIssues());
  // console.log('verifiersData.length ->', verifiersData.length);

  const verifiers = normalizeVerifiers(filterExistsInInterplanetaryApi(verifiersData));
  console.log('verifiers.length ->', verifiers.length);

  if (options?.enrichedBy === 'INTERPLANETARY_ONE') return enrichWithInfoFromInterplanetaryOne(verifiers);

  return verifiers;
}
