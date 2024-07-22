import { useEffect, useState } from "react";
import useBookFetch from "./useBookFetch";

function App() {
  const { books, getAllBook, createBook } = useBookFetch();
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorAge, setNewAuthorAge] = useState<number | null>(null);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    getAllBook();
  }, []);

  const handleCreateBook = () => {
    const newBook = {
      title: newBookTitle,
      author: {
        name: newAuthorName,
        age: newAuthorAge ?? 0,
      },
      content: newContent,
    };
    createBook(newBook);
    setNewBookTitle("");
    setNewAuthorName("");
    setNewAuthorAge(null);
    setNewContent("");
  };

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h2>{book.title}</h2>
            <p>{book.content}</p>
            <p>
              Author: {book.author?.name} (Age: {book.author?.age})
            </p>
          </li>
        ))}
      </ul>
      <h2>Create a New Book</h2>
      <input
        type="text"
        placeholder="Title"
        value={newBookTitle}
        onChange={(e) => setNewBookTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author Name"
        value={newAuthorName}
        onChange={(e) => setNewAuthorName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Author Age"
        value={newAuthorAge !== null ? newAuthorAge : ""}
        onChange={(e) => setNewAuthorAge(parseInt(e.target.value))}
      />
      <textarea
        placeholder="Content"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
      <button onClick={handleCreateBook}>Create Book</button>
    </div>
  );
}

export default App;
