import markdownIt from 'markdown-it';
import { addHttpsIfNotLocal, isAddressId, isAddressKey, normalizeVerifiers, trimAndClean } from '../utils/general';
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
import { getIssues } from './getIssues';

const getAllIssues = async () => await getIssues();

export const getVerifiersFromIssues = async (
  issues: any = undefined,
  options?: { normalized: boolean | undefined },
) => {
  const issuesToUse = (!!issues && issues) || (await getAllIssues());
  const data = await Promise.allSettled(
    issuesToUse.map((v) => {
      // console.log(v);
      // return {...getVerifierFromIssue(v)};
      const data = getVerifierFromIssue(v);
      return data;
    }),
  );
  const returnThis = data.map((v) => v.status === 'fulfilled' && v.value).filter((v) => !!v);
  // console.log(returnThis);
  return (!!options?.normalized && normalizeVerifiers(returnThis)) || returnThis;
  // return data.map((v) => v.status === 'fulfilled' && v.value);
};

export const getVerifierFromIssue = async (issue: any = undefined, options?: { normalized: boolean | undefined }) => {
  const bodyParsed = markdownIt().render(issue.body);

  const region = getRegion(bodyParsed) && trimAndClean(getRegion(bodyParsed)[1]);

  // If address is not present in the issue body, we look for it in the comments
  let address = getAddress(bodyParsed);
  let newAddress;
  if ((!address || !address[1]) && Array.isArray(issue.comments)) {
    const { comments } = issue;

    newAddress = comments
      ?.flatMap((v: any) => v.body)
      ?.filter((v: any) => /approved.*\r\n.*address/im.test(v))
      ?.flat();
    newAddress = address && /approved.*[\r\n]*.*address.*[\r\n]*.*\s+(f[0-9]+[^\r]+)/im.exec(address[0]);
  }
  address = newAddress || (address && address[1]);
  address = trimAndClean(address);

  const addressId = isAddressId(address) && address; // || (isAddressKey(address) && (await getAddressIdFromKey(address)));
  const addressKey = isAddressKey(address) && address; // || (isAddressId(address) && (await getAddressKeyFromId(address)));
  const name = getName(bodyParsed) && trimAndClean(getName(bodyParsed)[1]);
  // if (issue.number === 460) console.log('bodyParsed(460) ->', bodyParsed);
  // if (issue.number === 460) console.log('getName(bodyParsed)(460) ->', getName(bodyParsed));
  const organization = getOrganization(bodyParsed) && trimAndClean(getOrganization(bodyParsed)[1]);
  const websiteAndSocial = getWebsiteAndSocial(bodyParsed) && trimAndClean(getWebsiteAndSocial(bodyParsed)[1]);

  // console.log();
  return {
    issueNumber: issue.number,
    addressId: addressId || null,
    addressKey: addressKey || null,
    // address,
    name,
    organization,
    region,
    websiteAndSocial,
  };
};
