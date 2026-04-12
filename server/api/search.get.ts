import type { NominatimResult } from '~/lib/types';

import { SearchSchema } from '~/lib/zod-schemas';
import defineAuthenticatedEventHandler from '~/utils/define-authenticated-event-handler';
import sendZodError from '~/utils/send-zod-error';

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'hobby-project-nuxt-map-application | jorgekupfer@gmx.de',
        },
      });

      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: 'Failed to reach search api 2',
        }));
      }

      const results = await response.json() as NominatimResult[];

      return results;
    }
    catch {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: 'Failed to reach search api 3',
      }));
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: 'placeSearch-nominatim',
    getKey: async (event) => {
      const query = await getQuery(event);
      return query.q?.toString() || '';
    },
  }),
);

//  https://nominatim.openstreetmap.org/search?<params>
