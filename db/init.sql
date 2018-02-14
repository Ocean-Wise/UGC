DROP DATABASE IF EXISTS ugc;
CREATE DATABASE ugc;

\c ugc;

CREATE TABLE ocean (
  ID SERIAL PRIMARY KEY,
  PostType VARCHAR,
  TextContent VARCHAR,
  ContentURL VARCHAR,
  Author VARCHAR,
  Profile VARCHAR
);

INSERT INTO ocean (PostType, TextContent, ContentURL, Author, Profile)
  VALUES('twitter', 'This is a post on #twitter', 'https://twitter.com/', '@ethan_dinnen', 'https://some.url/');
