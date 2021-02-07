import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
        return {
                keyArgs: false, // tells apollo we will take care of everything
                read(existing = [], { args, cache }) {
                        console.log({ existing, args, cache });
                        const { skip, first } = args;
                        // Read the number of items of the page from the cache
                        const data = cache.readQuery({ query: PAGINATION_QUERY });
                        const count = data?._allProductsMeta?.count;
                        const page = skip / first + 1;
                        const pages = Math.ceil(count / first);
                        // check if we have existing items
                        const items = existing.slice(skip, skip + first).filter((x) => x);
                        // If
                        // There are items
                        // AND there aren't enough items to satisfy how many were requested
                        // AND we are on the first page
                        // THEN JUST SEND IT

                        if (items.length && items.length !== first && page === pages) {
                                return items;
                        }
                        if (items.length !== first) {
                                // we don't have and items we must go to the network to fetch them
                                return false;
                        }

                        // if there are items in the cache, just return them from the cache and we don't need to go for the network
                        if (items.length) {
                                console.log(`There are ${items.length} items in the cache! Gonna send them to apollo`);
                                return items;
                        }
                        return false; // fallback to network, just in case
                        // first thing it does is ask the read fucntion for those items
                        // We can either do one of these two:
                        // First thing we can do is return the items because they are already in the cache
                        // The other thing we can do is to return false from here (network request)
                },
                merge(existing, incoming, { args }) {
                        const { skip, first } = args;
                        // this runs when the apollo client comes back from the network with our products
                        const merged = existing ? existing.slice(0) : [];
                        for (let i = skip; i < skip + incoming.length; ++i) {
                                merged[i] = incoming[i - skip];
                        }
                        // finally we return the merged items from the cache
                        return merged;
                },
        };
}
