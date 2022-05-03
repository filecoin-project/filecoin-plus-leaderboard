import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVerifiers } from '../../lib/getVerifiersRefactored';
import { withSentry } from '@sentry/nextjs';

async function verifiers(req: VercelRequest, res: VercelResponse) {
  const response = await getVerifiers();

  res.status(200).json(response);
}

// @ts-ignore
export default withSentry(verifiers);
