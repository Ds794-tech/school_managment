import React, { useState, useEffect } from "react";
import { showError, showSuccess } from "../utils/sweetAlertConfig";

export default function AddEditBoardModal({ onClose, editData, fetchSchoolDetailProfile }) {
    const [formData, setFormData] = useState({
        board: "",
        register_number: "",
        udisecode: "",
        preschool: "no",
        nursery: "no",
        JKG: "no",
        SKG: "no",
    });

    const classOptions = [
        "preschool",
        "nursery",
        "JKG",
        "SKG",
        ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`),
    ];

    const schoolId = localStorage.getItem("schoolId");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (cls) => {
        const key = cls.toLowerCase()
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key] === "yes" ? "no" : "yes",
        }));
    };

    console.log("Edit Data:", formData);

    useEffect(() => {
        if (editData && editData.id) {
            const fetchBoard = async () => {
                try {
                    const response = await fetch(`https://digiteach.pythonanywhere.com/school_board_detail/${editData.id}/`);
                    if (!response.ok) throw new Error("Failed to fetch board");
                    const result = await response.json();
                    if (result.data) {
                        const boardData = result.data;
                        setFormData(boardData);
                    }
                } catch (err) {
                    console.error("Error fetching job:", err);
                    setError("Failed to load job details");
                }
            };
            fetchBoard();
        }
    }, [editData.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        // setError("");

        try {
            // Required fields validation

            const requiredFields = [
                "board",
                "register_number",
                "udisc_code",
            ];

            const missingFields = requiredFields.filter((field) => !formData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
            }

            // Prepare data
            const boardData = {
                school_id: parseInt(schoolId),
                board: formData.board,
                register_number: formData.register_number,
                udisc_code: formData.udisc_code,
            };


            const url = editData && editData.id
                ? `https://digiteach.pythonanywhere.com/school_board_detail/${editData.id}/`
                : "https://digiteach.pythonanywhere.com/school_board_detail/";

            const method = editData && editData.id ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(boardData)
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
                editData && editData.id ? 'Book Updated!' : 'Book Posted!',
                editData && editData.id ? 'The Book has been updated successfully.' : 'The Book has been posted successfully.'
            );
            fetchSchoolDetailProfile();
            onClose();
            // if (onSuccess) onSuccess();
            // navigate("/school-dashboard", { state: { activeTab: "Book Management" } });
        } catch (err) {
            console.error("Error saving job:", err);
            const errorMessage = err.message || "An error occurred while saving the job";
            // setError(errorMessage);
            await showError('Error', errorMessage);
        } finally {
            // setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                    {editData && editData.id ? "Edit Board Details" : "Add New Board Details"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                Board *
                            </label>
                            <input
                                type="text"
                                name="board"
                                placeholder="e.g., CBSE, ICSE, State Board"
                                value={formData.board}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                Register Number
                            </label>
                            <input
                                type="text"
                                name="register_number"
                                value={formData.register_number}
                                onChange={handleChange}
                                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                UDISE Code
                            </label>
                            <input
                                type="text"
                                name="udisc_code"
                                value={formData.udisc_code}
                                onChange={handleChange}
                                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Classes Offered */}
                    <div>
                        <p className="text-sm text-gray-700 font-medium mb-2">
                            Classes Offered
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {classOptions.map((cls) => {
                                const key = cls.toLowerCase().replace("class ", "class_")
                                return (
                                    <label
                                        key={cls}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
                                            name={key}
                                            value={formData[key]}
                                            checked={formData[key] === "yes"}
                                            onChange={() => handleCheckbox(cls)}
                                            className="h-4 w-4 border-gray-300"
                                        />
                                        {cls}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-500 text-white px-5 py-2 rounded-md hover:bg-amber-600 transition"
                        >
                            {editData ? "Update Board" : "Save Board"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
