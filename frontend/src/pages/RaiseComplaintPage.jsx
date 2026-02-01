import { useState } from "react";

const RaiseComplaintPage = () => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just logging (later connect backend / Firebase)
    console.log("Complaint Submitted:", formData);

    alert("Complaint submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Raise a Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Complaint Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complaint Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electricity">Electricity</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Internet">Internet</option>
              <option value="Room">Room</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describe the issue clearly..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Submit Complaint
          </button>

        </form>
      </div>
    </div>
  );
};

export default RaiseComplaintPage;