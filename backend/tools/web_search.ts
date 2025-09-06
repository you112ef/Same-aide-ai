interface WebSearchArgs {
  query: string;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export async function web_search({ query }: WebSearchArgs): Promise<{ results: SearchResult[] } | { error: string }> {
  console.log(`Simulating web search for: "${query}"`);

  // NOTE: This is a mock implementation.
  // In a real-world application, this function would call a real search API
  // (e.g., Google Search API, Bing Search API, SerpAPI) to get live results.
  // We are returning hardcoded data here to allow for the development of the
  // AI integration and frontend display without needing a live API key.

  const mockResults: SearchResult[] = [
    {
      title: `How to use React Hooks: A Complete Guide`,
      link: "https://react.dev/reference/react",
      snippet: "A comprehensive guide to using React Hooks, including useState, useEffect, useContext, and more, with practical examples.",
    },
    {
      title: `MDN Web Docs: JavaScript`,
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      snippet: "The complete reference for the JavaScript language, including guides and tutorials for developers of all skill levels.",
    },
    {
      title: `Stack Overflow - Where Developers Learn, Share, & Build Careers`,
      link: "https://stackoverflow.com",
      snippet: `The world's largest online community for programmers to learn, share their knowledge, and build their careers. Your query was: "${query}"`,
    },
  ];

  return { results: mockResults };
}
