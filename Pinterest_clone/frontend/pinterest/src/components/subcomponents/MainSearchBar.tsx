import React, { useState, useEffect } from "react";
import api from "../../api/apiRequests.tsx";


const SearchBar: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [output, setOutput] = useState<any>("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("categories/");
        console.log(response.data);
        setCategories(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (categories.length > 0) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex].name;

        // Add class to start transition
        const inputElement = document.querySelector('.searchInput') as HTMLInputElement;
        inputElement.classList.add('transitioning');

        // Wait for transition to finish before updating
        setTimeout(() => {
          setOutput(randomCategory);
          inputElement.classList.remove('transitioning');
        }, 500); // Adjust timing to match CSS transition
      }
    }, 3000);

    // Cleanup interval on component unmount or categories change
    return () => clearInterval(intervalId);
  }, [categories]);

  return (
    <form className="searchForm">
      <input
        type="text"
        placeholder={`Search for ${output}`}
        className="searchInput"
      />
     
    </form>
  );
};

export default SearchBar;
