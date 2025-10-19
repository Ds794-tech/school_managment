import { useEffect, useState } from "react";
import { FaSchool, FaBook, FaClipboardList, FaUser, FaTasks, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function AdminDashboard({ setIsAdmin }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  // Fetch schools
  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school/");
      const result = await res.json();
      if (Array.isArray(result.data)) {
        setSchools(result.data);
      } else {
        setSchools([]);
      }
    } catch (err) {
      console.error("Failed to fetch schools:", err);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/vendor/");
      const result = await res.json();
      console.log("Vendor fetch result:", result);
      if (Array.isArray(result)) {
        setVendors(result);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchVendors()
  }, []);

  const handleStatusVendorChange = async (id, status) => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/vendor/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approve_status: status }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend response:", text);
        throw new Error("Failed to update status");
      }
      fetchVendors();
      setSelectedVendor(null); // close modal if open
    }
    catch (err) {
      alert(err.message);
    }
  };

  // Accept / Reject school
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/school/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: status }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend response:", text);
        throw new Error("Failed to update status");
      }
      fetchSchools();
      setSelectedSchool(null); // close modal if open
    } catch (err) {
      alert(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="flex items-center justify-center py-6 font-bold text-xl border-b border-blue-600">
          DigiTeach
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <button className="flex items-center gap-3 px-4 py-2 bg-blue-600 rounded-lg">
            <FaTasks /> Dashboard
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaClipboardList /> Jobs
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaBook /> Book Inventory
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaSchool /> Orders
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaStore /> Vendor
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaUser /> Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Top bar */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-full text-sm"
            />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard cards */}
        <div className="grid grid-cols-4 gap-6 p-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Total Jobs</p>
            <h2 className="text-2xl font-bold">20</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Books</p>
            <h2 className="text-2xl font-bold">35</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold">7</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Drivers</p>
            <h2 className="text-2xl font-bold">5</h2>
          </div>
        </div>

        {/* Schools Table (your actual data) */}
        <div className="p-6">
          {loading ? (
            <p>Loading schools...</p>
          ) : schools.length === 0 ? (
            <p>No schools found</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">School Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Contact Person</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">City</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schools.map((school) => (
                    <tr key={school.id}>
                      <td className="px-4 py-2 text-sm">{school.id}</td>
                      <td className="px-4 py-2 text-sm">{school.school_name}</td>
                      <td className="px-4 py-2 text-sm">{school.school_email}</td>
                      <td className="px-4 py-2 text-sm">{school.contact_person_name}</td>
                      <td className="px-4 py-2 text-sm">{school.city}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={school.is_active ? "text-green-600" : "text-red-600"}>
                          {school.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm flex gap-2">
                        <button
                          onClick={() => setSelectedSchool(school)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusChange(school.id, true)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(school.id, false)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for School Details */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-2/3 rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedSchool(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">School Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>ID:</strong> {selectedSchool.id}</p>
              <p><strong>School Name:</strong> {selectedSchool.school_name}</p>
              <p><strong>Email:</strong> {selectedSchool.school_email}</p>
              <p><strong>Contact Person:</strong> {selectedSchool.contact_person_name}</p>
              <p><strong>Contact Number:</strong> {selectedSchool.contact_number}</p>
              <p><strong>Designation:</strong> {selectedSchool.designation_data?.name}</p>
              <p><strong>City:</strong> {selectedSchool.city}</p>
              <p><strong>District:</strong> {selectedSchool.district}</p>
              <p><strong>Address Line 1:</strong> {selectedSchool.address_line_1}</p>
              <p><strong>Address Line 2:</strong> {selectedSchool.address_line_2}</p>
              <p><strong>Landmark:</strong> {selectedSchool.landmark}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={selectedSchool.is_active ? "text-green-600" : "text-red-600"}>
                  {selectedSchool.is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleStatusChange(selectedSchool.id, true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(selectedSchool.id, false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
{/* 
      <div className="p-6">
        {loading ? (
          <p>Loading Vendor...</p>
        ) : vendors.length === 0 ? (
          <p>No vendor found</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendor Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendor Mobile</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendor Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">City</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-4 py-2 text-sm">{vendor.id}</td>
                    <td className="px-4 py-2 text-sm">{vendor.vendor_name}</td>
                    <td className="px-4 py-2 text-sm">{vendor.vendor_mobile}</td>
                    <td className="px-4 py-2 text-sm">{vendor.vendor_email}</td>
                    <td className="px-4 py-2 text-sm">{vendor.city}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={vendor.approve_status == "Not Approved" && "text-red-600" ||
                        vendor.approve_status == "Approved" && "text-green-600" ||
                        vendor.approve_status == "Rejected" && "text-red-600" ||
                        vendor.approve_status == "Pending" && "text-yellow-600"
                      }>
                        {vendor.approve_status == "Not Approved" && "Inactive"}
                        {vendor.approve_status == "Approved" && "Active"}
                        {vendor.approve_status == "Rejected" && "Rejected"}
                        {vendor.approve_status == "Pending" && "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm flex gap-2">
                      <button
                        onClick={() => setSelectedSchool(vendor)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleStatusVendorChange(vendor.id, "Approved")}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusVendorChange(vendor.id, false)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
    </div>
  );
}
