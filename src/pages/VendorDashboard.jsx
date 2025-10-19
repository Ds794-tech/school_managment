import { useEffect, useState } from "react";
import { FaSchool, FaBook, FaClipboardList, FaUser, FaTasks, FaTachometerAlt } from "react-icons/fa";

export default function VendorDashboard({ setIsVendor }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Fetch schools
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/vendor/");
      const result = await res.json();
      if (Array.isArray(result)) {
        setVendors(result);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error("Failed to fetch schools:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Accept / Reject school
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/vendor/${id}/`,
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
      fetchVendors();
      setSelectedVendors(null); // close modal if open
    } catch (err) {
      alert(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isVendor");
    setIsVendor(false);
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
          {[
            { name: "Dashboard", icon: FaTachometerAlt },
            // { name: "Jobs", icon: FaBriefcase },
            // { name: "Book Management", icon: FaBook },
            // { name: "Class Management", icon: FaSchool },
            // { name: "Profile", icon: FaUser },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left ${activeTab === tab.name ? "bg-blue-600" : "hover:bg-blue-600"}`}
            >
              <tab.icon /> {tab.name}
            </button>
          ))}
          {/* <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaClipboardList /> Jobs
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaBook /> Book Inventory
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaSchool /> Orders
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg">
            <FaUser /> Profile
          </button> */}
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
        {/* <div className="grid grid-cols-4 gap-6 p-6">
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
        </div> */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-2xl px-6 pt-5 font-bold text-gray-800">Posted Vendor List</h2>
          {/* <button
            onClick={() => navigate("/job-form")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <FaEdit /> Post New Job
          </button> */}
        </div>

        {/* Schools Table (your actual data) */}
        <div className="p-6">
          {loading ? (
            <p>Loading Vendor...</p>
          ) : vendors.length === 0 ? (
            <p>No Vendor found</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company Logo</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendor Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mobile No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vendor Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Website</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">City</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="px-4 py-5 text-sm">{vendor.id}</td>
                      <td className="px-4 py-5 text-sm"><img className="w-28 h-20" src={`https://digiteach.pythonanywhere.com/${vendor.companey_logo}`} alt="vendorImage" /></td>
                      <td className="px-4 py-5 text-sm">{vendor.vendor_name}</td>
                      <td className="px-4 py-5 text-sm">{vendor.vendor_mobile}</td>
                      <td className="px-4 py-5 text-sm">{vendor.vendor_email}</td>
                      <td className="px-4 py-5 text-sm">{vendor.vendor_website}</td>
                      <td className="px-4 py-5 text-sm">{vendor.city}</td>
                      <td className="px-4 py-5 text-sm">
                        <span className={vendor.approve_status === "Approved" ? "text-green-600" : vendor.approve_status === "Not Approved" ? "text-red-600" : "text-yellow-600"}>
                          {vendor.approve_status === "Not Approved" && "Rejected"}
                          {vendor.approve_status === "Approved" && "Accepted"}
                          {vendor.approve_status === "Pending" && "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-12 text-sm flex gap-2">
                        <button
                          onClick={() => setSelectedVendors(vendor)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusChange(vendor.id, "Approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleStatusChange(vendor.id, "Not Approved")}
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
      {selectedVendors && (
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
    </div>
  );
}
