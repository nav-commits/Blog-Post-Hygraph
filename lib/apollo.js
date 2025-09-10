import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT,
    fetch, // required in Next.js server components
  }),
  cache: new InMemoryCache(),
});

export default client;
