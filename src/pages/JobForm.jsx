import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccess, showError } from "../utils/sweetAlertConfig";

export default function JobForm({ onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const schoolId = localStorage.getItem("schoolId");

  const [formData, setFormData] = useState({
    school_data: parseInt(schoolId),
    job_title: "",
    job_description: "",
    job_type: "Full-Time",
    subject: "",
    experience_required: "",
    qualification: "",
    salary_range: [],
    posted_date: new Date().toISOString().split("T")[0],
    last_date_to_apply: "",
    status: "Open",
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch job details if editing
  useEffect(() => {
    if (isEditMode && id) {
      const fetchJob = async () => {
        try {
          const response = await fetch(`https://digiteach.pythonanywhere.com/job/${id}/`);
          if (!response.ok) throw new Error("Failed to fetch job");
          const result = await response.json();
          if (result.data) {
            const jobData = result.data;
            setFormData({
              school_data: jobData.school_data?.id || schoolId,
              job_title: jobData.job_title || "",
              job_description: jobData.job_description || "",
              job_type: jobData.job_type || "Full-Time",
              subject: jobData.subject || "",
              experience_required: jobData.experience_required || "",
              qualification: jobData.qualification || "",
              salary_range: jobData.salary_range || "",
              posted_date: jobData.posted_date || new Date().toISOString().split("T")[0],
              last_date_to_apply: jobData.last_date_to_apply || "",
              status: jobData.status || "Open",
              is_active: jobData.status === "Open"
            });
          }
        } catch (err) {
          console.error("Error fetching job:", err);
          setError("Failed to load job details");
        }
      };
      fetchJob();
    }
  }, [id, isEditMode, schoolId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Required fields validation
      const requiredFields = [
        "job_title",
        "job_description",
        "subject",
        "experience_required",
        "qualification",
        "salary_range",
        "last_date_to_apply"
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }

      // Prepare data
      const jobData = {
        school_data: parseInt(formData.school_data),
        job_title: formData.job_title,
        job_description: formData.job_description,
        job_type: formData.job_type,
        subject: formData.subject,
        experience_required: formData.experience_required,
        qualification: formData.qualification,
        salary_range: Array.isArray(formData.salary_range) 
          ? formData.salary_range.map(s => s.trim()).filter(s => s) 
          : [String(formData.salary_range || '').trim()].filter(s => s),
        posted_date: formData.posted_date,
        last_date_to_apply: formData.last_date_to_apply,
        status: formData.is_active ? "Open" : "Closed"
      };
      
      console.log('Submitting job data:', jobData); // Debug log

      const url = isEditMode
        ? `https://digiteach.pythonanywhere.com/job/${id}/`
        : "https://digiteach.pythonanywhere.com/job/";

      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.detail ||
            responseData.message ||
            Object.values(responseData).flat().join("\n") ||
            "Failed to save job"
        );
      }

      await showSuccess(
        isEditMode ? 'Job Updated!' : 'Job Posted!',
        isEditMode ? 'The job has been updated successfully.' : 'The job has been posted successfully.'
      );
      if (onSuccess) onSuccess();
     navigate("/school-dashboard", { state: { activeTab: "jobs" } });
    } catch (err) {
      console.error("Error saving job:", err);
      const errorMessage = err.message || "An error occurred while saving the job";
      setError(errorMessage);
      await showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Job Posting" : "Post a New Job"}
        </h2>
        <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← Back to Jobs
        </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Job Title *</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Job Type *</label>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Experience Required (years) *</label>
            <input
              type="number"
              name="experience_required"
              value={formData.experience_required}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Qualification */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Qualification *</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Salary Range (per month) *</label>
            <select
              name="salary_range"
              value={formData.salary_range[0] || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  salary_range: value ? [value] : []
                }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Salary Range</option>
              <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
              <option value="₹20,000 - ₹30,000">₹20,000 - ₹30,000</option>
              <option value="₹30,000 - ₹40,000">₹30,000 - ₹40,000</option>
              <option value="₹40,000 - ₹50,000">₹40,000 - ₹50,000</option>
              <option value="₹50,000 - ₹75,000">₹50,000 - ₹75,000</option>
              {/* <option value="₹75,000 - ₹1,00,000">₹75,000 - ₹1,00,000</option>
              <option value="₹1,00,000 - ₹1,50,000">₹1,00,000 - ₹1,50,000</option>
              <option value="Above ₹1,50,000">Above ₹1,50,000</option>
              <option value="Negotiable">Negotiable</option> */}
            </select>
          </div>

          {/* Last Date to Apply */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Last Date to Apply *</label>
            <input
              type="date"
              name="last_date_to_apply"
              value={formData.last_date_to_apply}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Job Description *</label>
          <textarea
            name="job_description"
            value={formData.job_description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter detailed job description, responsibilities, and requirements..."
            required
          />
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">This job posting is active</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (isEditMode ? "Updating..." : "Posting...") : isEditMode ? "Update Job" : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
