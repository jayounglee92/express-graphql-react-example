import { useState } from "react";

// schema에서 정의된 타입을 typescript로 재정의.
type Author = {
  name?: string;
  age?: number;
};
type Book = {
  id: number;
  title: string;
  author?: Author;
  content?: string;
};
type BookInput = Omit<Book, "id">;

// fetch option.
// GraphQL은 모든 요청에 대해 기본적으로 아래 option을 사용.
const fetchCommonOption = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// backend에 schema를 토대로 요청할 데이터의 query 작성 query.
const commonQuery = `
  id
  title
  author {
    name
    age
  }
  content
`;

const useBookFetch = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // 모든 책을 가져오는 함수.
  const getAllBook = () => {
    const query = `{
      getAllBook {
        ${commonQuery}
      }
    }`;

    fetch("http://localhost:4000/graphql", {
      ...fetchCommonOption,
      body: JSON.stringify({
        query,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setBooks(data.data.getAllBook);
        } else if (data.errors) {
          console.error("GraphQL errors:", data.errors);
        }
        console.log("data returned:", data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  };

  // 책을 생성하는 함수.
  const createBook = (book: BookInput) => {
    // Mutation의 경우, mutation 접두사를 붙인다.
    // $input은 Rest API의 payload에 해당.
    // body에 variables로, query와 함께 보낸다.
    const query = `
      mutation createBook($input: BookInput) {
        createBook(input: $input) {
          ${commonQuery}
        }
      }
    `;

    fetch("http://localhost:4000/graphql", {
      ...fetchCommonOption,
      body: JSON.stringify({
        query,
        variables: {
          input: {
            ...book,
          },
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("data returned:", data);
        if (data.data) {
          getAllBook();
        } else if (data.errors) {
          console.error("GraphQL errors:", data.errors);
        }
      })
      .catch((error) => console.error("Error creating book:", error));
  };

  return {
    books,
    getAllBook,
    createBook,
  };
};

export default useBookFetch;
