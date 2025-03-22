import { Department } from "../models/department.model.js";
import { User } from "../models/user.model.js";
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        if(!departments){
            return res.status(404).json({ message: "No departments found" });
        }

        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error });
    }
};


export const addDepartment = async (req, res) => {
    try {
        const { code } = req.body;

        // Check if department already exists
        const existingDept = await Department.findOne({ code });
        if (existingDept) {
            return res.status(400).json({ message: "Department already exists" });
        }

        const newDepartment = new Department({ code });
        await newDepartment.save();
        res.status(201).json({ message: "Department added successfully", newDepartment });
    } catch (error) {
        res.status(500).json({ message: "Error adding department", error });
    }
};

// ✅ Delete a department by code
export const deleteDepartment = async (req, res) => {
    try {
        const { code } = req.params;
        const deletedDept = await Department.findOneAndDelete({ code });

        if (!deletedDept) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department deleted successfully", deletedDept });
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error });
    }
};


export const getFacultiesByDepartment = async (req, res) => {
    try {
        const { code } = req.params;
        const faculties = await User.find({ department: code, role: "faculty" }).select("name email");
        
        if (faculties.length === 0) {
            return res.status(404).json({ message: "No faculties found for this department" });
        }

        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching faculties", error });
    }
};