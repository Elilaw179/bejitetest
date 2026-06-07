import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-8">
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by job title, company, or skill..."
          className="w-full border-0 pl-12 pr-4 py-4 text-lg focus:ring-0 outline-none rounded-xl"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
