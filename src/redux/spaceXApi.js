import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const spaceXApi = createApi({
  reducerPath: 'spaceXApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.spacexdata.com/' }),
  endpoints: (build) => ({
    getRockets: build.query({
      query: () => 'v4/rockets',
    }),
    getLaunches: build.mutation({
      query: (body) => ({
        url: 'v5/launches/query',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetLaunchesMutation, useGetRocketsQuery } = spaceXApi;
