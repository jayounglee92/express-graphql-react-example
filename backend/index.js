const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server");
const cors = require("cors");

// schema를 확인해 데이터 요청에 필요한 query를 작성할 수 있다.
// String, Int, ID, input 등은 GraphQL schema language를 따른다.
const schema = buildSchema(`
  type Author {
    name: String
    age: Int
  }

  type Book {
    id: ID!
    title: String!
    author: Author
    content: String
  }

  input AuthorInput {
    name: String
    age: Int
  }

  input BookInput {
    title: String!
    author: AuthorInput
    content: String
  }

  type Query {
    getAllBook: [Book]
  }

  type Mutation {
    createBook(input: BookInput): [Book]
  }
`);

// Mock database.
let fakeDatabase = [
  {
    id: 1,
    title: "TITLE",
    author: {
      name: "han",
      age: 1,
    },
    content: "blabla",
  },
];

// 위에서 정의한 엔드포인트에 실제.
const root = {
  getAllBook() {
    return fakeDatabase;
  },

  createBook({ input }) {
    const id = fakeDatabase[fakeDatabase.length - 1]
      ? fakeDatabase[fakeDatabase.length - 1].id + 1
      : 1;

    fakeDatabase.push({ ...input, id });

    return fakeDatabase;
  },
};

const app = express();

app.use(cors()); // CORS 미들웨어 사용

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});
