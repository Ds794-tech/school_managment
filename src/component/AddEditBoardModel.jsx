import React, { useState, useEffect } from "react";

export default function AddEditBoardModal({ onClose, onSave, editData }) {
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

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (cls) => {
        const key = cls
            .toLowerCase()
            .replace("class ", "class_")
            .replace("junior kg", "JKG")
            .replace("senior kg", "SKG");

        setFormData((prev) => ({
            ...prev,
            [key]: prev[key] === "yes" ? "no" : "yes",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                    {editData ? "Edit Board Details" : "Add New Board Details"}
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
                                name="udisecode"
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
                                const key = cls
                                    .toLowerCase()
                                    .replace("class ", "class_")
                                    .replace("preschool", "preschool")
                                    .replace("nursery", "nursery");

                                return (
                                    <label
                                        key={cls}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
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
