// import { useEffect, useState } from "react";
// import {
//   FaTachometerAlt,
//   FaBriefcase,
//   FaUser,
//   FaSignOutAlt,
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaTimes,
//   FaCalendarAlt,
//   FaGraduationCap,
//   FaChalkboardTeacher,
//   FaMapMarkerAlt,
//   FaClock,
//   FaMoneyBillWave,
//   FaInfoCircle
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Swal from 'sweetalert2';

// export default function SchoolDashboard({ setIsSchool }) {
//   const [school, setSchool] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Dashboard");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [jobs, setJobs] = useState([]);
//   const [isLoadingJobs, setIsLoadingJobs] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showJobDetails, setShowJobDetails] = useState(false);


//   const schoolId = localStorage.getItem("schoolId");
//   const navigate = useNavigate();

//   // Fetch school profile
//   const fetchSchoolProfile = async () => {
//     try {
//       const res = await fetch("https://digiteach.pythonanywhere.com/school/");
//       if (!res.ok) throw new Error("Failed to fetch schools");
//       const result = await res.json();
//       const currentSchool = result.data.find(
//         (s) => s.id.toString() === schoolId
//       );
//       setSchool(currentSchool || null);
//       setEditData(currentSchool || {});
//     } catch (err) {
//       console.error(err);
//       setSchool(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch jobs and calculate applicant count
//   const fetchJobs = async () => {
//     if (!schoolId) return;
//     setIsLoadingJobs(true);

//     try {
//       const [jobsResponse, teachersResponse] = await Promise.all([
//         fetch("https://digiteach.pythonanywhere.com/job/"),
//         fetch("https://digiteach.pythonanywhere.com/teacher/")
//       ]);

//       if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
//       if (!teachersResponse.ok) throw new Error("Failed to fetch teachers");

//       const jobsData = await jobsResponse.json();
//       const teachersData = await teachersResponse.json();

//       const schoolJobs = jobsData.data.filter(
//         (job) => job.school_data?.id.toString() === schoolId
//       );

//       // Count applicants per job based on subject
//       const jobsWithApplicantCount = schoolJobs.map((job) => {
//         const subject = job.subject.split(',')[0].trim(); // Get the first subject if multiple
//         const matchingTeachers = teachersData.data.filter(teacher => 
//           teacher.subjects?.some(s => s.toLowerCase().includes(subject.toLowerCase()))
//         );
//         return { 
//           ...job, 
//           job_applicant_count: matchingTeachers.length,
//           matching_teachers: matchingTeachers
//         };
//       });

//       setJobs(jobsWithApplicantCount);
//     } catch (error) {
//       console.error(error);
//       setJobs([]);
//     } finally {
//       setIsLoadingJobs(false);
//     }
//   };

//   // Removed fetchApplicants function as we're using a separate page now

//   useEffect(() => {
//     if (schoolId) {
//       fetchSchoolProfile();
//       if (activeTab === "Jobs") fetchJobs();
//     }
//   }, [schoolId, activeTab]);

//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: 'Logout',
//       text: 'Are you sure you want to logout?',
//       icon: 'question',
//       position: 'center',
//       showCancelButton: true,
//       confirmButtonColor: '#2563eb',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, logout',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       localStorage.removeItem("isSchool");
//       localStorage.removeItem("schoolId");
//       setIsSchool(false);
//       window.location.href = "/";
//     }
//   };

//   const toggleEdit = () => setIsEditing(!isEditing);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditData({ ...editData, [name]: value });
//   };

//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         `https://digiteach.pythonanywhere.com/school/${schoolId}/`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(editData),
//         }
//       );
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.detail || "Failed to update profile");
//       }
//       const updated = await res.json();
//       setSchool(updated);
//       setIsEditing(false);

//       await Swal.fire({
//         position: 'center',
//         icon: 'success',
//         title: 'Profile Updated!',
//         text: 'Your profile has been updated successfully.',
//         showConfirmButton: true,
//         confirmButtonColor: '#2563eb',
//       });
//     } catch (err) {
//       console.error(err);
//       await Swal.fire({
//         position: 'center',
//         icon: 'error',
//         title: 'Update Failed',
//         text: err.message || 'Failed to update profile',
//         confirmButtonColor: '#dc2626',
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-full md:w-64 bg-blue-700 text-white flex flex-col md:flex-shrink-0">
//         <div className="flex items-center justify-center py-6 font-bold text-2xl border-b border-blue-600">
//           DigiTeach
//         </div>
//         <nav className="flex-1 p-4 space-y-4">
//           {[
//             { name: "Dashboard", icon: FaTachometerAlt },
//             { name: "Jobs", icon: FaBriefcase },
//             { name: "Profile", icon: FaUser },
//           ].map((tab) => (
//             <button
//               key={tab.name}
//               onClick={() => setActiveTab(tab.name)}
//               className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left ${
//                 activeTab === tab.name ? "bg-blue-600" : "hover:bg-blue-600"
//               }`}
//             >
//               <tab.icon /> {tab.name}
//             </button>
//           ))}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 rounded-lg text-red-300 hover:text-white w-full"
//           >
//             <FaSignOutAlt /> Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-4 md:p-6">
//         {/* Top Bar */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white px-4 md:px-6 py-4 shadow rounded-lg mb-6 gap-4 md:gap-0">
//           <h1 className="text-2xl font-bold">{activeTab}</h1>
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
//             <input
//               type="text"
//               placeholder="Search"
//               className="px-4 py-2 border rounded-full text-sm w-full md:w-64"
//             />
//             <div className="flex items-center gap-2">
//               <span className="font-medium">{school?.contact_person_name || "Loading..."}</span>
//               <img
//                 src="https://i.pravatar.cc/40"
//                 alt="avatar"
//                 className="w-8 h-8 rounded-full"
//               />
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Tab */}
//         {activeTab === "Dashboard" && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {loading ? (
//               <p>Loading...</p>
//             ) : !school ? (
//               <p>No school data found</p>
//             ) : (
//               <>
//                 <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition">
//                   <p className="text-gray-500">School Status</p>
//                   <p className={`font-bold text-lg ${school.is_active ? "text-green-600" : "text-red-600"}`}>
//                     {school.is_active ? "Active" : "Inactive"}
//                   </p>
//                 </div>
//                 <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-md p-6 hover:shadow-xl transition">
//                   <p className="text-gray-500">School Name</p>
//                   <p className="font-bold text-xl">{school.school_name}</p>
//                   <p className="mt-2 text-gray-600">{school.contact_person_name}</p>
//                 </div>
//                 <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-md p-6 hover:shadow-xl transition">
//                   <p className="text-gray-500">Location</p>
//                   <p className="font-bold text-lg">{school.city}, {school.district}</p>
//                   <p className="mt-2 text-gray-600">{school.address_line_1}, {school.address_line_2}, {school.landmark}</p>
//                 </div>
//                 <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl shadow-md p-6 hover:shadow-xl transition">
//                   <p className="text-gray-500">Contact</p>
//                   <p className="font-bold text-lg">{school.school_email}</p>
//                   <p className="mt-2 text-gray-600">Mobile: {school.contact_number}</p>
//                   <p className="mt-1 text-gray-600">Designation: {school.designation_data?.name}</p>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeTab === "Profile" && (
//           <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
//             {loading || !school ? (
//               <p>Loading profile...</p>
//             ) : (
//               <>
//                 <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
//                   <img
//                     src="https://i.pravatar.cc/100"
//                     alt="profile"
//                     className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
//                   />
//                   <div className="flex-1">
//                     <p className="text-2xl font-bold text-gray-800">{school.contact_person_name}</p>
//                     <p className="text-gray-500">{school.school_email}</p>
//                   </div>
//                   <button
//                     onClick={toggleEdit}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
//                   >
//                     <FaEdit /> {isEditing ? "Cancel" : "Edit"}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {[ "school_name", "school_email", "contact_person_name", "contact_number", "designation_data", "address_line_1", "address_line_2", "city", "district", "landmark"].map((field) => (
//                     <div key={field} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
//                       <p className="text-gray-500 text-sm">{field.replace("_", " ").toUpperCase()}</p>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           name={field}
//                           value={field === "designation_data" ? editData.designation_data?.name || "" : editData[field] || ""}
//                           onChange={handleChange}
//                           className="mt-1 p-2 w-full border rounded"
//                         />
//                       ) : (
//                         <p className="font-semibold text-lg">{field === "designation_data" ? school.designation_data?.name : school[field]}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {isEditing && (
//                   <div className="mt-4">
//                     <button
//                       onClick={handleSave}
//                       className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* Jobs Tab */}
//         {activeTab === "Jobs" && (
//           <div className="space-y-6">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Posted Jobs</h2>
//               <button
//                 onClick={() => navigate("/job-form")}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
//               >
//                 <FaEdit /> Post New Job
//               </button>
//             </div>

//             {isLoadingJobs ? (
//               <p>Loading jobs...</p>
//             ) : jobs.length === 0 ? (
//               <div className="bg-white rounded-xl shadow p-6 text-center">
//                 <p className="text-gray-500 mb-4">No jobs posted yet</p>
//                 <button
//                   onClick={() => navigate("/job-form")}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//                 >
//                   Post Your First Job
//                 </button>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border rounded-lg text-sm md:text-base">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       {["ID", "Title", "Subject", "Experience", "Qualification", "Type", "Status", "Posted", "Applications", "Actions"].map((h) => (
//                         <th key={h} className="text-left px-4 py-2">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {jobs.map((job) => (
//                       <tr key={job.id} className="border-b hover:bg-gray-50">
//                         <td className="px-4 py-2">{job.id}</td>
//                         <td className="px-4 py-2">{job.job_title}</td>
//                         <td className="px-4 py-2">{job.subject}</td>
//                         <td className="px-4 py-2">{job.experience_required}</td>
//                         <td className="px-4 py-2">{job.qualification}</td>
//                         <td className="px-4 py-2">{job.job_type}</td>
//                         <td className="px-4 py-2">
//                           <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
//                             {job.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-2">{new Date(job.posted_date).toLocaleDateString()}</td>
//                        <td className="px-4 py-2">
//   <span className="relative">
//     {job.job_applicant_count > 0 ? (
//       <span className="flex items-center gap-1">
//         {job.job_applicant_count}
//         <span className="text-xs text-gray-500">applicant{job.job_applicant_count !== 1 ? 's' : ''}</span>
//       </span>
//     ) : (
//       <span className="text-gray-400">No applicants</span>
//     )}
//   </span>
// </td>
//                         <td className="px-4 py-2 flex justify-center gap-3">
//                           <button 
//                             className="text-blue-600 hover:text-blue-800 text-lg relative" 
//                             onClick={() => {
//                               setSelectedJob(job);
//                               setShowJobDetails(true);
//                             }}
//                             title="View Job Details"
//                           >
//                             <FaEye />
//                           </button>
//                           <button 
//                             className="text-yellow-600 hover:text-yellow-800 text-lg" 
//                             onClick={() => navigate(`/job-form/${job.id}`, { onSuccess: fetchJobs })}
//                             title="Edit Job"
//                           >
//                             <FaEdit />
//                           </button>
//                          <button
//   className="text-red-600 hover:text-red-800 text-lg"
//   onClick={async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this job?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       reverseButtons: true,
//       position: "center", // ensures popup is centered
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await fetch(`https://digiteach.pythonanywhere.com/job/${job.id}/`, {
//           method: "DELETE",
//         });
//         if (!res.ok) throw new Error("Failed to delete job");

//         await Swal.fire({
//           title: "Deleted!",
//           text: "The job has been deleted.",
//           icon: "success",
//           confirmButtonColor: "#2563eb",
//           position: "center",
//         });

//         fetchJobs(); // refresh job list
//       } catch (err) {
//         console.error(err);
//         await Swal.fire({
//           title: "Error",
//           text: "Failed to delete job",
//           icon: "error",
//           confirmButtonColor: "#dc2626",
//           position: "center",
//         });
//       }
//     }
//   }}
//   title="Delete Job"
// >
//   <FaTrash />
// </button>

//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//       </div>

//       {/* Job Details Modal */}
//       {showJobDetails && selectedJob && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-gray-800">{selectedJob.job_title}</h2>
//                 <button 
//                   onClick={() => setShowJobDetails(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <FaTimes size={24} />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <FaChalkboardTeacher className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Subject</p>
//                       <p className="font-medium">{selectedJob.subject}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <FaGraduationCap className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Qualification</p>
//                       <p className="font-medium">{selectedJob.qualification}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <FaCalendarAlt className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Experience Required</p>
//                       <p className="font-medium">{selectedJob.experience_required}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Job Type</p>
//                       <p className="font-medium">{selectedJob.job_type}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Location</p>
//                       <p className="font-medium">
//                         {selectedJob.city}, {selectedJob.district}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <FaMoneyBillWave className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Salary</p>
//                       <p className="font-medium">
//                         {selectedJob.salary || 'Not specified'}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <FaCalendarAlt className="text-blue-500 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Posted On</p>
//                       <p className="font-medium">
//                         {new Date(selectedJob.posted_date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <div className="text-blue-500 mt-1">
//                       <FaInfoCircle className="flex-shrink-0" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Status</p>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         selectedJob.status === 'Open' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {selectedJob.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {selectedJob.job_description && (
//                 <div className="mt-6">
//                   <h3 className="text-lg font-semibold mb-2">Job Description</h3>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="whitespace-pre-line">{selectedJob.job_description}</p>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-6 flex flex-wrap gap-3">
//                 <button
//                   onClick={() => navigate(`/job-applicants/${selectedJob.id}`)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//                 >
//                   View Applicants ({selectedJob.job_applicant_count || 0})
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowJobDetails(false);
//                     navigate(`/job-form/${selectedJob.id}`, { onSuccess: fetchJobs });
//                   }}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//                 >
//                   <FaEdit /> Edit Job
//                 </button>
//                 <button
//                   onClick={async () => {
//                     if (window.confirm('Are you sure you want to delete this job?')) {
//                       try {
//                         await fetch(`https://digiteach.pythonanywhere.com/job/${selectedJob.id}/`, {
//                           method: 'DELETE',
//                         });
//                         setShowJobDetails(false);
//                         fetchJobs();
//                       } catch (error) {
//                         console.error('Error deleting job:', error);
//                         alert('Failed to delete job');
//                       }
//                     }
//                   }}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//                 >
//                   <FaTrash /> Delete Job
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUser,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendarAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaInfoCircle,
  FaBook,
  FaSchool
} from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import AddBoardModal from "../component/AddEditBoardModel";
import AddEditBoardModal from "../component/AddEditBoardModel";

export default function SchoolDashboard({ setIsSchool }) {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingSchoolDetail, setIsLoadingSchoolDetail] = useState(false);
  const [editBoard, setEditBoard] = useState(null);

  const [book, setBooks] = useState([]);
  const [classes, setClasses] = useState([]);
  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedBook, setSelectBook] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [bookSet, setBookSet] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [schoolDetail, setSchoolDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [selectedClass, setSelectBook] = useState(null);
  // const [selectedBook, setSelectBook] = useState(null);

  const schoolId = localStorage.getItem("schoolId");
  const navigate = useNavigate();

  // Fetch school profile
  const fetchSchoolProfile = async () => {
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      const currentSchool = result.data.find(
        (s) => s.id.toString() === schoolId
      );
      setSchool(currentSchool || null);
      setEditData(currentSchool || {});
    } catch (err) {
      console.error(err);
      setSchool(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/books/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      // const currentSchool = result.data.find(
      //   (s) => s.id.toString() === schoolId
      // );
      console.log(result.data);
      setBooks(result.data || []);
      setIsLoadingBooks(false)
    } catch (err) {
      console.error(err);
      setBooks([]);
      setIsLoadingBooks(false)
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const fetchSchoolDetailProfile = async () => {
    setIsLoadingSchoolDetail(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school_board_detail/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      // const currentSchool = result.data.find(
      //   (s) => s.id.toString() === schoolId
      // );
      console.log(result.data);
      setSchoolDetail(result.data || []);
      setIsLoadingSchoolDetail(false)
    } catch (err) {
      console.error(err);
      setSchoolDetail([]);
      setIsLoadingSchoolDetail(false)
    } finally {
      setIsLoadingSchoolDetail(false);
    }
  };

  const fetchBookSet = async () => {
    setIsLoadingBooks(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/book_set/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      // const currentSchool = result.data.find(
      //   (s) => s.id.toString() === schoolId
      // );
      console.log(result.data);
      setBookSet(result.data || []);
      setIsLoadingBooks(false)
    } catch (err) {
      console.error(err);
      setBookSet([]);
      setIsLoadingBooks(false)
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const fetchClasses = async () => {
    setIsLoadingClasses(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/classes/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      const currentData = result.data.filter(
        (s) => s.class_name.includes(filterYear)
      );
      console.log(currentData, 'currentData');
      setClasses(currentData || result.data);
      setFilteredClasses(result.data);
      setIsLoadingClasses(false)
    } catch (err) {
      console.error(err);
      setClasses([]);
      setFilteredClasses([]);
      setIsLoadingClasses(false)
    } finally {
      setIsLoadingClasses(false);
    }
  };

  console.log(filterYear, 'filterYear');

  // Fetch jobs and applicants
  const fetchJobs = async () => {
    if (!schoolId) return;
    setIsLoadingJobs(true);

    try {
      const [jobsResponse, teachersResponse] = await Promise.all([
        fetch("https://digiteach.pythonanywhere.com/job/"),
        fetch("https://digiteach.pythonanywhere.com/teacher/")
      ]);

      if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
      if (!teachersResponse.ok) throw new Error("Failed to fetch teachers");

      const jobsData = await jobsResponse.json();
      const teachersData = await teachersResponse.json();

      const schoolJobs = jobsData.data.filter(
        (job) => job.school_data?.id.toString() === schoolId
      );

      // Count applicants per job based on subject
      const jobsWithApplicantCount = schoolJobs.map((job) => {
        const subject = job.subject.split(',')[0].trim();
        const matchingTeachers = teachersData.data.filter(teacher =>
          teacher.subjects?.some(s => s.toLowerCase().includes(subject.toLowerCase()))
        );
        return {
          ...job,
          job_applicant_count: matchingTeachers.length,
          matching_teachers: matchingTeachers
        };
      });

      setJobs(jobsWithApplicantCount);
    } catch (error) {
      console.error(error);
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchSchoolProfile();
      fetchSchoolDetailProfile();
      if (activeTab === "Jobs") fetchJobs();
      if (activeTab === "Book Management") fetchBooks();
      if (activeTab === "Class Management") fetchClasses();
      if (activeTab === "Book Set") fetchBookSet();
    }
  }, [schoolId, activeTab, filterYear]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      localStorage.removeItem("isSchool");
      localStorage.removeItem("schoolId");
      setIsSchool(false);
      window.location.href = "/";
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/school/${schoolId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }
      const updated = await res.json();
      setSchool(updated);
      setIsEditing(false);
      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        confirmButtonColor: '#2563eb',
      });
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Failed to update profile',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleApplicantAction = async (job, teacher, status) => {
    try {
      await Swal.fire({
        position: "center",
        icon: status === "accepted" ? "success" : "error",
        title: `Applicant ${status === "accepted" ? "Accepted" : "Rejected"}!`,
        html: `
          <p><b>${teacher.name}</b> has been <b>${status}</b> 
          for the job <b>${job.job_title}</b>.</p>
        `,
        confirmButtonColor: status === "accepted" ? "#16a34a" : "#dc2626",
      });

      // TODO: API call to update applicant status in backend
    } catch (error) {
      console.error("Failed to update applicant:", error);
    }
  };

  const handleSaveData = (data) => {
    if (editBoard) {
      // Update existing board
      setBoards((prev) =>
        prev.map((b) => (b.id === editBoard.id ? { ...b, ...data } : b))
      );
    } else {
      // Add new board
      setBoards((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setShowModal(false);
    setEditBoard(null);
  };

  const handleEdit = (board) => {
    setEditBoard(board);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-700 text-white flex flex-col md:flex-shrink-0">
        <div className="flex items-center justify-center py-6 font-bold text-2xl border-b border-blue-600">
          DigiTeach
        </div>
        <nav className="flex-1 p-4 space-y-4">
          {[
            { name: "Dashboard", icon: FaTachometerAlt },
            { name: "Jobs", icon: FaBriefcase },
            { name: "Book Management", icon: FaBook },
            { name: "Class Management", icon: FaSchool },
            { name: "Book Set", icon: FaBookBookmark },
            { name: "Profile", icon: FaUser },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left ${activeTab === tab.name ? "bg-blue-600" : "hover:bg-blue-600"}`}
            >
              <tab.icon /> {tab.name}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 rounded-lg text-red-300 hover:text-white w-full"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white px-4 md:px-6 py-4 shadow rounded-lg mb-6 gap-4 md:gap-0">
          <h1 className="text-2xl font-bold">{activeTab}</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-full text-sm w-full md:w-64"
            />
            <div className="flex items-center gap-2">
              <span className="font-medium">{school?.contact_person_name || "Loading..."}</span>
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === "Dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <p>Loading...</p> : !school ? <p>No school data found</p> : (
              <>
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition">
                  <p className="text-gray-500">School Status</p>
                  <p className={`font-bold text-lg ${school.is_active ? "text-green-600" : "text-red-600"}`}>
                    {school.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <p className="text-gray-500">School Name</p>
                  <p className="font-bold text-xl">{school.school_name}</p>
                  <p className="mt-2 text-gray-600">{school.contact_person_name}</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <p className="text-gray-500">Location</p>
                  <p className="font-bold text-lg">{school.city}, {school.district}</p>
                  <p className="mt-2 text-gray-600">{school.address_line_1}, {school.address_line_2}, {school.landmark}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <p className="text-gray-500">Contact</p>
                  <p className="font-bold text-lg">{school.school_email}</p>
                  <p className="mt-2 text-gray-600">Mobile: {school.contact_number}</p>
                  <p className="mt-1 text-gray-600">Designation: {school.designation_data?.name}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "Profile" && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              {loading || !school ? <p>Loading profile...</p> : (
                <>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                    <img
                      src="https://i.pravatar.cc/100"
                      alt="profile"
                      className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-gray-800">{school.contact_person_name}</p>
                      <p className="text-gray-500">{school.school_email}</p>
                    </div>
                    <button
                      onClick={toggleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
                    >
                      <FaEdit /> {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["school_name", "school_email", "contact_person_name", "contact_number", "designation_data", "address_line_1", "address_line_2", "city", "district", "landmark"].map((field) => (
                      <div key={field} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">{field.replace("_", " ").toUpperCase()}</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name={field}
                            value={field === "designation_data" ? editData.designation_data?.name || "" : editData[field] || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded"
                          />
                        ) : (
                          <p className="font-semibold text-lg">{field === "designation_data" ? school.designation_data?.name : school[field]}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="mt-4">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <div className="pt-10 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    School Board Details
                  </h2>
                  <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    <span>+ Add New Board</span>
                  </button>
                </div>

                {schoolDetail.map((board, index) => (
                  <div
                    key={board.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Board #{index + 1}: {board.board}
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(board)} className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition">
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(board.id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 border rounded-md p-3">
                        <p className="text-sm text-gray-500">Board</p>
                        <p className="font-semibold text-gray-800">{board.board}</p>
                      </div>

                      <div className="bg-gray-50 border rounded-md p-3">
                        <p className="text-sm text-gray-500">Register Number</p>
                        <p className="font-semibold text-gray-800">
                          {board.register_number}
                        </p>
                      </div>

                      <div className="bg-gray-50 border rounded-md p-3">
                        <p className="text-sm text-gray-500">UDISE Code</p>
                        <p className="font-semibold text-gray-800">{board.udisc_code}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Classes Offered</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(board).filter(([key, value]) => key.startsWith("class_") && value === "yes")
                          .map(([key]) => key.replace("class_", "Class ")).length > 0 ? (
                          Object.entries(board)
                            .filter(([key, value]) => key.startsWith("class_") && value === "yes")
                            .map(([key]) => (
                              <span
                                key={key}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                              >
                                {key.replace("class_", "Class ")}
                              </span>
                            ))
                        ) : (
                          <p className="text-gray-400">No classes offered</p>
                        )
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {showModal && (
              <AddEditBoardModal
                onClose={() => {
                  setShowModal(false);
                  setEditBoard(null);
                }}
                onSave={handleSave}
                editData={editBoard}
              />
            )}
          </>
        )}


        {/* Jobs Tab */}
        {activeTab === "Jobs" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Posted Jobs List</h2>
              <button
                onClick={() => navigate("/job-form")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
              >
                <FaEdit /> Post New Job
              </button>
            </div>

            {isLoadingJobs ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No jobs posted yet</p>
                <button
                  onClick={() => navigate("/job-form")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg text-sm md:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      {["ID", "Title", "Subject", "Experience", "Qualification", "Type", "Status", "Posted", "Applications", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{job.id}</td>
                        <td className="px-4 py-2">{job.job_title}</td>
                        <td className="px-4 py-2">{job.subject}</td>
                        <td className="px-4 py-2">{job.experience_required}</td>
                        <td className="px-4 py-2">{job.qualification}</td>
                        <td className="px-4 py-2">{job.job_type}</td>
                        <td className="px-4 py-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(job.posted_date).toLocaleDateString()}</td>

                        {/* Applicants */}
                        <td className="px-4 py-2">
                          {job.job_applicant_count > 0 ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowApplicants(true);
                              }}
                            >
                              {job.job_applicant_count} applicant{job.job_applicant_count !== 1 ? "s" : ""}
                            </button>
                          ) : (
                            <span className="text-gray-400">No applicants</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-2 flex justify-center gap-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 text-lg"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowJobDetails(true);
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="text-yellow-600 hover:text-yellow-800 text-lg"
                            onClick={() => navigate(`/job-form/${job.id}`, { onSuccess: fetchJobs })}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 text-lg"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "Are you sure?",
                                text: "Do you want to delete this job?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,
                                position: "center",
                              });

                              if (result.isConfirmed) {
                                try {
                                  const res = await fetch(`https://digiteach.pythonanywhere.com/job/${job.id}/`, {
                                    method: "DELETE",
                                  });
                                  if (!res.ok) throw new Error("Failed to delete job");

                                  await Swal.fire({
                                    title: "Deleted!",
                                    text: "Job deleted successfully.",
                                    icon: "success",
                                    confirmButtonColor: "#16a34a",
                                  });
                                  fetchJobs();
                                } catch (err) {
                                  console.error(err);
                                  Swal.fire({
                                    icon: "error",
                                    title: "Failed",
                                    text: "Could not delete job",
                                    confirmButtonColor: "#dc2626",
                                  });
                                }
                              }
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Job Details Modal */}
        {showJobDetails && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedJob.job_title}</h2>
                <button onClick={() => setShowJobDetails(false)}>
                  <FaTimes />
                </button>
              </div>
              <p><b>Subject:</b> {selectedJob.subject}</p>
              <p><b>Qualification:</b> {selectedJob.qualification}</p>
              <p><b>Experience:</b> {selectedJob.experience_required}</p>
              <p><b>Job Type:</b> {selectedJob.job_type}</p>
              <p><b>Salary:</b> {selectedJob.salary || "Not specified"}</p>
              <p><b>Location:</b> {selectedJob.city}, {selectedJob.district}</p>
              <p><b>Status:</b> {selectedJob.status}</p>
              <p><b>Posted:</b> {new Date(selectedJob.posted_date).toLocaleDateString()}</p>
              {selectedJob.job_description && (
                <div className="mt-4">
                  <h3 className="font-semibold">Description:</h3>
                  <p>{selectedJob.job_description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applicants Modal */}
        {showApplicants && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Applicants for {selectedJob.job_title}</h2>
                <button onClick={() => setShowApplicants(false)}>
                  <FaTimes />
                </button>
              </div>
              {selectedJob.matching_teachers?.length > 0 ? (
                <div className="space-y-4">
                  {selectedJob.matching_teachers.map((teacher, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <p className="font-semibold">{teacher.name}</p>
                        <p className="text-gray-600">Email: {teacher.email}</p>
                        <p className="text-gray-600">Phone: {teacher.phone_number}</p>
                        <p className="text-gray-600">Subjects: {teacher.subjects?.join(", ")}</p>
                        <p className="text-gray-600">Experience: {teacher.experience} years</p>
                        {teacher.resume_url ? (
                          <a href={teacher.resume_url} target="_blank" className="text-blue-600 hover:underline">View Resume</a>
                        ) : <p className="text-gray-400">No Resume Uploaded</p>}
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={() => handleApplicantAction(selectedJob, teacher, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => handleApplicantAction(selectedJob, teacher, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No applicants found.</p>
              )}
            </div>
          </div>
        )}

        {/* Books Management Tab */}


        {activeTab === "Book Management" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-2xl font-bold text-gray-800">Posted Books List</h2>
              <button
                onClick={() => navigate("/book-form")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
              >
                <FaEdit /> Create New Book
              </button>
            </div>

            {isLoadingBooks ? (
              <p>Loading Books...</p>
            ) : book.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No Book posted yet</p>
                {/* <button
                  onClick={() => navigate("/job-form")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Post Your First Book
                </button> */}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg text-sm md:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      {["ID", "Title", "Author", "Publisher", "Class", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {book.map((bookData) => (
                      <tr key={bookData.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{bookData.id}</td>
                        <td className="px-4 py-2">{bookData.book_title}</td>
                        <td className="px-4 py-2">{bookData.book_author}</td>
                        <td className="px-4 py-2">{bookData.book_publisher}</td>
                        <td className="px-4 py-2">{bookData.class_name}</td>
                        {/* <td className="px-4 py-2">{bookData.job_type}</td> */}
                        {/* <td className="px-4 py-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {job.status}
                          </span>
                        </td> */}
                        {/* <td className="px-4 py-2">{new Date(job.posted_date).toLocaleDateString()}</td> */}

                        {/* Applicants */}
                        {/* <td className="px-4 py-2">
                          {job.job_applicant_count > 0 ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowApplicants(true);
                              }}
                            >
                              {job.job_applicant_count} applicant{job.job_applicant_count !== 1 ? "s" : ""}
                            </button>
                          ) : (
                            <span className="text-gray-400">No applicants</span>
                          )}
                        </td> */}

                        {/* Actions */}
                        <td className="px-4 py-2 flex justify-start gap-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 text-lg"
                            onClick={() => {
                              setSelectBook(bookData);
                              setShowBookDetails(true);
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="text-yellow-600 hover:text-yellow-800 text-lg"
                            onClick={() => navigate(`/book-form/${bookData.id}`, { onSuccess: fetchBooks })}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 text-lg"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "Are you sure?",
                                text: "Do you want to delete this book?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,
                                position: "center",
                              });

                              if (result.isConfirmed) {
                                try {
                                  const res = await fetch(`https://digiteach.pythonanywhere.com/books/${bookData.id}/`, {
                                    method: "DELETE",
                                  });
                                  if (!res.ok) throw new Error("Failed to delete job");

                                  await Swal.fire({
                                    title: "Deleted!",
                                    text: "Book deleted successfully.",
                                    icon: "success",
                                    confirmButtonColor: "#16a34a",
                                  });
                                  fetchBooks();
                                } catch (err) {
                                  console.error(err);
                                  Swal.fire({
                                    icon: "error",
                                    title: "Failed",
                                    text: "Could not delete Book",
                                    confirmButtonColor: "#dc2626",
                                  });
                                }
                              }
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* book Details Modal */}
        {showBookDetails && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Title : {selectedBook.book_title}</h2>
                <button onClick={() => setShowBookDetails(false)}>
                  <FaTimes />
                </button>
              </div>
              <p><b>Author:</b> {selectedBook.book_author}</p>
              <p><b>Publisher:</b> {selectedBook.book_publisher}</p>
              <p><b>Class:</b> {selectedBook.class_name}</p>
            </div>
          </div>
        )}

        {activeTab === "Class Management" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-2xl font-bold text-gray-800">Posted Class List</h2>
              <div className="flex items-center gap-4">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="mr-4 px-3 py-2 border rounded-lg cursor-pointer px-4 py-2 rounded-lg shadow flex items-center gap-2"
                >
                  <option value="">All Classes</option>
                  {
                    filteredClasses
                      .map(c => {
                        return <option key={c.class_name} value={c.class_name}>{c.class_name}</option>
                      })
                  }
                </select>
                <button
                  onClick={() => navigate("/class-form")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                >
                  <FaEdit /> Create Class
                </button>
              </div>
            </div>

            {isLoadingClasses ? (
              <p>Loading Classes...</p>
            ) : classes.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No Class posted yet</p>
                {/* <button
                  onClick={() => navigate("/job-form")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Post Your First Book
                </button> */}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg text-sm md:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      {["ID", "Board", "Academy Year", "Class", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classData) => (
                      <tr key={classData.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{classData.id}</td>
                        <td className="px-4 py-2">{classData.board}</td>
                        <td className="px-4 py-2">{classData.academic_year}</td>
                        <td className="px-4 py-2">{classData.class_name}</td>
                        {/* <td className="px-4 py-2">{bookData.class_name}</td> */}
                        {/* <td className="px-4 py-2">{bookData.job_type}</td> */}
                        {/* <td className="px-4 py-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {job.status}
                          </span>
                        </td> */}
                        {/* <td className="px-4 py-2">{new Date(job.posted_date).toLocaleDateString()}</td> */}

                        {/* Applicants */}
                        {/* <td className="px-4 py-2">
                          {job.job_applicant_count > 0 ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowApplicants(true);
                              }}
                            >
                              {job.job_applicant_count} applicant{job.job_applicant_count !== 1 ? "s" : ""}
                            </button>
                          ) : (
                            <span className="text-gray-400">No applicants</span>
                          )}
                        </td> */}

                        {/* Actions */}
                        <td className="px-4 py-2 flex justify-start gap-3">
                          {/* <button
                            className="text-blue-600 hover:text-blue-800 text-lg"
                            onClick={() => {
                              setSelectBook(bookData);
                              setShowBookDetails(true);
                            }}
                          >
                            <FaEye />
                          </button> */}
                          <button
                            className="text-yellow-600 hover:text-yellow-800 text-lg"
                            onClick={() => navigate(`/class-form/${classData.id}`, { onSuccess: fetchClasses })}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 text-lg"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "Are you sure?",
                                text: "Do you want to delete this Class?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,
                                position: "center",
                              });

                              if (result.isConfirmed) {
                                try {
                                  const res = await fetch(`https://digiteach.pythonanywhere.com/classes/${classData.id}/`, {
                                    method: "DELETE",
                                  });
                                  if (!res.ok) throw new Error("Failed to delete Class");

                                  await Swal.fire({
                                    title: "Deleted!",
                                    text: "Class deleted successfully.",
                                    icon: "success",
                                    confirmButtonColor: "#16a34a",
                                  });
                                  fetchClasses();
                                } catch (err) {
                                  console.error(err);
                                  Swal.fire({
                                    icon: "error",
                                    title: "Failed",
                                    text: "Could not delete Class",
                                    confirmButtonColor: "#dc2626",
                                  });
                                }
                              }
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "Book Set" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-2xl font-bold text-gray-800">Posted Book Set List</h2>
              <button
                onClick={() => navigate("/book-set-form")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
              >
                <FaEdit /> Create Book Set
              </button>
            </div>

            {isLoadingBooks ? (
              <p>Loading BooK Set...</p>
            ) : bookSet.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No Book Set posted yet</p>
                {/* <button
                  onClick={() => navigate("/job-form")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Post Your First Book
                </button> */}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg text-sm md:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      {["Book Set ID", "Class ID", "Academy Year", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookSet.map((bookSetData) => (
                      <tr key={bookSetData.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{bookSetData.id}</td>
                        <td className="px-4 py-2">{bookSetData.class_detail_id}</td>
                        <td className="px-4 py-2">{bookSetData.academic_year}</td>
                        {/* <td className="px-4 py-2">{bookData.class_name}</td> */}
                        {/* <td className="px-4 py-2">{bookData.class_name}</td> */}
                        {/* <td className="px-4 py-2">{bookData.job_type}</td> */}
                        {/* <td className="px-4 py-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {job.status}
                          </span>
                        </td> */}
                        {/* <td className="px-4 py-2">{new Date(job.posted_date).toLocaleDateString()}</td> */}

                        {/* Applicants */}
                        {/* <td className="px-4 py-2">
                          {job.job_applicant_count > 0 ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowApplicants(true);
                              }}
                            >
                              {job.job_applicant_count} applicant{job.job_applicant_count !== 1 ? "s" : ""}
                            </button>
                          ) : (
                            <span className="text-gray-400">No applicants</span>
                          )}
                        </td> */}

                        {/* Actions */}
                        <td className="px-4 py-2 flex justify-start gap-3">
                          {/* <button
                            className="text-blue-600 hover:text-blue-800 text-lg"
                            onClick={() => {
                              setSelectBook(bookData);
                              setShowBookDetails(true);
                            }}
                          >
                            <FaEye />
                          </button> */}
                          <button
                            className="text-yellow-600 hover:text-yellow-800 text-lg"
                            onClick={() => navigate(`/book-set-form/${bookSetData.id}`, { onSuccess: fetchBookSet })}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 text-lg"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "Are you sure?",
                                text: "Do you want to delete this book set?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,
                                position: "center",
                              });

                              if (result.isConfirmed) {
                                try {
                                  const res = await fetch(`https://digiteach.pythonanywhere.com/book_set/${bookSetData.id}/`, {
                                    method: "DELETE",
                                  });
                                  if (!res.ok) throw new Error("Failed to delete book set");

                                  await Swal.fire({
                                    title: "Deleted!",
                                    text: "book set deleted successfully.",
                                    icon: "success",
                                    confirmButtonColor: "#16a34a",
                                  });
                                  fetchBookSet();
                                } catch (err) {
                                  console.error(err);
                                  Swal.fire({
                                    icon: "error",
                                    title: "Failed",
                                    text: "Could not delete book set",
                                    confirmButtonColor: "#dc2626",
                                  });
                                }
                              }
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
