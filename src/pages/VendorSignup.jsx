import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function VendorSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_pass: "",
    vendor_companey_name: "",
    vendor_website: "",
    companey_GST_number: "",
    companey_logo: null, // store file object
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value, // ✅ handle files correctly
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Use FormData (don't JSON.stringify it)
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/vendor/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error:", errData);
        let errorMessage = "Failed to create vendor";
        if (errData.detail) {
          errorMessage = errData.detail;
        } else if (typeof errData === "object") {
          errorMessage = Object.values(errData).flat().join("\n");
        }
        throw new Error(errorMessage);
      }

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Success!",
        text: "Vendor created successfully! Waiting for admin approval.",
        showConfirmButton: true,
        confirmButtonColor: "#2563eb",
      });

      navigate("/admin-dashboard");
    } catch (err) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: err.message || "An error occurred while creating the Vendor",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Signup</h2>

        <input
          type="text"
          name="vendor_name"
          placeholder="Vendor Name"
          value={form.vendor_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="vendor_mobile"
          placeholder="Vendor Mobile"
          value={form.vendor_mobile}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="vendor_email"
          placeholder="Vendor Email"
          value={form.vendor_email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="vendor_pass"
          placeholder="Vendor Password"
          value={form.vendor_pass}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="vendor_companey_name"
          placeholder="Vendor Company Name"
          value={form.vendor_companey_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="vendor_website"
          placeholder="Vendor Website"
          value={form.vendor_website}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="companey_GST_number"
          placeholder="Company GST Number"
          value={form.companey_GST_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* ✅ File input correctly handled */}
        <input
          type="file"
          name="companey_logo"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
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
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
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
