import React, { useState } from "react";
import { Tag } from "../interfaces/userInterface";
import api from "../api/apiRequests.tsx";

const CreatePin: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [category, setCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();

      const tagExists = tags.some((t) => t === newTag);
      if (!tagExists) {
        setTags([...tags, newTag]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: Tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // if (!file) {
    //   alert("Please upload an image.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("category", customCategory || category);
    formData.append("image", file);


    // console.log(formData);
    formData.append("tags", JSON.stringify(tags)); // Fix: Send tags as JSON string

    // console.log("Form Data:", Object.fromEntries(formData.entries()));

    

    try {
      setLoading(true);
      const response = await api.post("posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Post Created:");
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating post:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-pin">
      <h3>Create Pin</h3>
      <form onSubmit={handleSubmit}>
        <div className="image-holder">
          <p>Upload Image</p>
          <input
            type="file"
            
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files) setFile(files[0]);
            }}
          />
          {file && <p className="file-info">Selected File: {file.name}</p>}
        </div>
        <div className="pin-other-data">
          <p>Caption</p>
          <input
            type="text"
            placeholder="Add a Caption"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>Tags</p>
          <input
            type="text"
            placeholder="Press Enter to Add Tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagAdd}
          />
          <div className="tags-list">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p>Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>
              Select a category
            </option>
            <option value="nature">Nature</option>
            <option value="technology">Technology</option>
            <option value="art">Art</option>
          </select>
          <p>or</p>
          <input
            type="text"
            placeholder="Add a custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default CreatePin;
