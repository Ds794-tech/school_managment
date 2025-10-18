

// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // export default function SchoolSignup() {
// //   const navigate = useNavigate();
// //   const [form, setForm] = useState({
// //     school_name: "",
// //     school_email: "",
// //     school_address: "",
// //     contact_person_name: "",
// //     contact_number: "",
// //     designation_data: 1,       // pass ID of designation
// //     address_line_1: "",
// //     address_line_2: "",
// //     landmark: "",
// //     city: "",
// //     district: "",
// //     is_active: false,          // default inactive
// //   });

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await fetch("https://digiteach.pythonanywhere.com/school/", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(form),
// //       });

// //       if (!res.ok) {
// //         const errData = await res.json();
// //         console.error("Error:", errData);
// //         throw new Error("Failed to create school");
// //       }

// //       alert("School created successfully! Waiting for admin approval.");
// //       navigate("/admin-dashboard");  // redirect to admin dashboard
// //     } catch (err) {
// //       alert(err.message);
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen items-center justify-center bg-gray-100">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4"
// //       >
// //         <h2 className="text-2xl font-bold mb-4 text-center">School Signup</h2>

// //         <input
// //           type="text"
// //           name="school_name"
// //           placeholder="School Name"
// //           value={form.school_name}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="email"
// //           name="school_email"
// //           placeholder="School Email"
// //           value={form.school_email}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="school_address"
// //           placeholder="School Address"
// //           value={form.school_address}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="contact_person_name"
// //           placeholder="Contact Person Name"
// //           value={form.contact_person_name}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="number"
// //           name="contact_number"
// //           placeholder="Contact Number"
// //           value={form.contact_number}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="text"
// //           name="city"
// //           placeholder="City"
// //           value={form.city}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="text"    
// //           name="district"
// //           placeholder="District"
// //           value={form.district}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />

// //         <button
// //           type="submit"
// //           className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
// //         >
// //           Sign Up
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function SchoolSignup() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     school_name: "",
//     school_email: "",
//     school_address: "",
//     contact_person_name: "",
//     contact_number: "",
//     designation_data: 1, // default ID, you can make it selectable
//     address_line_1: "",
//     address_line_2: "",
//     landmark: "",
//     city: "",
//     district: "",
//     // is_active: false, // default inactive
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("https://digiteach.pythonanywhere.com/school/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         console.error("Error:", errData);
//         throw new Error("Failed to create school");
//       }

//       alert("School created successfully! Waiting for admin approval.");
//       navigate("/admin-dashboard");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">School Signup</h2>

//         <input
//           type="text"
//           name="school_name"
//           placeholder="School Name"
//           value={form.school_name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="email"
//           name="school_email"
//           placeholder="School Email"
//           value={form.school_email}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="school_address"
//           placeholder="School Address"
//           value={form.school_address}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="contact_person_name"
//           placeholder="Contact Person Name"
//           value={form.contact_person_name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="contact_number"
//           placeholder="Contact Number"
//           value={form.contact_number}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         {/* Designation as a select */}
//         <select
//           name="designation_data"
//           value={form.designation_data}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         >
//           <option>Select</option>
//           <option value={1}>IT Head</option>
//           <option value={2}>Principal</option>
//           <option value={3}>Teacher</option>
//         </select>

//         <input
//           type="text"
//           name="address_line_1"
//           placeholder="Address Line 1"
//           value={form.address_line_1}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="address_line_2"
//           placeholder="Address Line 2"
//           value={form.address_line_2}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="landmark"
//           placeholder="Landmark"
//           value={form.landmark}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={form.city}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="district"
//           placeholder="District"
//           value={form.district}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

        

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SchoolSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    school_name: "",
    school_email: "",
    contact_person_name: "",
    contact_number: "", 
    designation_data: 1, // default ID, you can make it selectable
     school_address: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    district: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error:", errData);
        let errorMessage = "Failed to create school";
        if (errData.detail) {
          errorMessage = errData.detail;
        } else if (typeof errData === 'object') {
          errorMessage = Object.values(errData).flat().join('\n');
        }
        throw new Error(errorMessage);
      }

      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success!',
        text: 'School created successfully! Waiting for admin approval.',
        showConfirmButton: true,
        confirmButtonColor: '#2563eb',
      });
      navigate("/admin-dashboard");
    } catch (err) {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: err.message || 'An error occurred while creating the school',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">School Signup</h2>

        <input
          type="text"
          name="school_name"
          placeholder="School Name"
          value={form.school_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="school_email"
          placeholder="School Email"
          value={form.school_email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
       
        <input
          type="text"
          name="contact_person_name"
          placeholder="Contact Person Name"
          value={form.contact_person_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text" // changed from number to text
          name="contact_number"
          placeholder="Contact Number"
          value={form.contact_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Designation as a select */}
        <select
          name="designation_data"
          value={form.designation_data}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value={1}>IT Head</option>
          <option value={2}>Principal</option>
          <option value={3}>Teacher</option>
        </select>

 <input
          type="text"
          name="school_address"
          placeholder="School Address"
          value={form.school_address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address_line_1"
          placeholder="Address Line 1"
          value={form.address_line_1}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address_line_2"
          placeholder="Address Line 2"
          value={form.address_line_2}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="landmark"
          placeholder="Landmark"
          value={form.landmark}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="district"
          placeholder="District"
          value={form.district}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
