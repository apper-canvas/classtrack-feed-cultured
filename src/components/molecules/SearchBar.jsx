import React, { useState, useEffect } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search...", className }) => {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm, onSearch])

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={20} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-white border-gray-300 focus:ring-primary focus:border-primary"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar