import React, { createContext, useContext, useState } from "react";

const BookmarkContext = createContext();

const BookmarkProvider = ({ children }) => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  const toggleBookmark = (article) => {
    // Check if the article is already bookmarked
    const isBookmarked = bookmarkedArticles.some(
      (b) => b.title === article.title
    );

    if (isBookmarked) {
      // If bookmarked, remove it
      setBookmarkedArticles((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.title !== article.title)
      );
    } else {
      // If not bookmarked, add it
      setBookmarkedArticles((prevBookmarks) => [...prevBookmarks, article]);
    }
  };

  const removeBookmark = (articleTitle) => {
    // Remove the bookmark with the specified title
    setBookmarkedArticles((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark.title !== articleTitle)
    );
  };

  const getBookmarks = () => bookmarkedArticles;

  return (
    <BookmarkContext.Provider
      value={{ toggleBookmark, removeBookmark, getBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider"
    );
  }
  return context;
};

export { BookmarkProvider, useBookmarkContext };
