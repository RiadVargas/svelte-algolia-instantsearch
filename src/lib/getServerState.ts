import type { InstantSearch } from "instantsearch.js";
import { getInitialResults, waitForResults } from "instantsearch.js/es/lib/server";
import { getContext } from "svelte";
import { render } from "svelte/server";

const serverContext = Symbol("InstantSearch:serverContext");

export const getServerContext = () =>
  getContext<{ notifyServer: (search: InstantSearch) => void; serverUrl: URL }>(serverContext);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getServerState(component: any, serverUrl: URL): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    const notifyServer = async (search: InstantSearch) => {
      await waitForResults(search);
      const results = getInitialResults(search.mainIndex);
      search.dispose();
      resolve(results);
    };
    render(component, { context: new Map([[serverContext, { notifyServer, serverUrl }]]) });
  });
}
