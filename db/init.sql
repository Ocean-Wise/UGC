DROP DATABASE IF EXISTS ugc;
CREATE DATABASE ugc;

\c ugc;

CREATE TABLE test_search (
  ID SERIAL PRIMARY KEY,
  Source VARCHAR,
  TextContent VARCHAR,
  ContentURL VARCHAR,
  Author VARCHAR
);

INSERT INTO test_search (Source, TextContent, ContentURL, Author)
  VALUES('twitter', 'This is a post on #twitter', 'https://twitter.com/', '@ethan_dinnen');
