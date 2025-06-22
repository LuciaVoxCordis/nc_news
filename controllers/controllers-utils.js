function extractQueries(query1, query2, querystring) {
  const regex = /(?<==)\w*\b/g;
  const queries = querystring.match(regex);
  return { [query1]: queries[0], [query2]: queries[1] };
}

module.exports = { extractQueries };
