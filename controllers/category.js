const asyncHandler = require("express-async-handler");
const path = require('path');
const { uploadToS3, checkFileExistance } = require("../utils/functions");
const mongoose = require("mongoose");
const Category = require('../models/categoryModel');

const saveCategoryData = async (req, res) => {
    const categoryLogo = req.files.logo;
    let catData;
    if (req.body.jsonData) {
        try {
            catData = JSON.parse(req.body.jsonData);
        } catch (jsonErr) {
            console.error(jsonErr);
            return res.status(400).json({ error: 'Invalid JSON data' });
        }
    }
    const sencondParseData = JSON.parse(catData);
    //console.log('sencondParseData', sencondParseData);
    const { category_code, category_name, description, operational_group } = sencondParseData;
    const owner = req.user._id;
    // Validate JSON data against the schema
    const newCategory = new Category({
        category_code, category_name, description, operational_group
    });

    try {
        // Save the store to get the store ID
        const savedCategory = await newCategory.save();
        let returnUpdateCategory = savedCategory;
        if (categoryLogo) {
            returnUpdateCategory = await updateCategoryLogo(savedCategory._id, category_name, categoryLogo);
        }

        res.status(201).send({
            data: returnUpdateCategory,
            message: "Category Successfully Creted!",
            statusCode: 201,
            error: false
        })
    } catch (err) {
        console.error(err);
        res.status(501).send({ error: true, data: [], statusCode: 501, message: "Error Found! Can not create category!" });
    }
};

const updateCategoryLogo = async (category_id, category_name, file) => {
    const filetypes = /jpeg|jpg|png|pdf|docx/;
    const extname = filetypes.test(path.extname(file.name).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    const fileExtension = file.mimetype.split("/")[1];
    const directory = "categories";
    //const timestamp = Date.now();
    const logoFilePath = `${directory}/${category_id}/logo_${category_name}.${fileExtension}`;
    if (mimetype && extname) {
        const result = await uploadToS3(file, logoFilePath);
        if (result) {
            const logoDetails = {
                filePath: result.Location,
                fileType: file.mimetype,
                fileName: file.name
            };
            const updatedStore = await Category.findByIdAndUpdate(
                category_id,
                { logo: logoDetails },
                { new: true }
            );
            return updatedStore;
        } else {
            throw new Error('Can not update category logo!');
        }
    }
    else {
        throw new Error("Invalid file type!");
    }
}


const viewCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        res.status(200).send({
            data: category,
            message: "Category Data Successfully Retrieve!",
            error: false
        });
    } else {
        res.status(404).send({
            data: [],
            message: "Data with given ID not found!",
            error: true
        })
    }
});

const editCategory = asyncHandler(async (req, res) => {
    const categoryLogo = req.files.logo;
    //const fileExtension = categoryLogo.mimetype.split("/")[1];
    let catData;
    if (req.body.jsonData) {
        try {
            catData = JSON.parse(req.body.jsonData);
        } catch (jsonErr) {
            console.error(jsonErr);
            return res.status(400).json({ error: 'Invalid JSON data' });
        }
    }
    const sencondParseData = JSON.parse(catData);
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: req.params.id },
            {
                ...sencondParseData
            },
            {
                returnDocument: 'after',     // Return the updated document
                //projection: { password: 0 } // Exclude 'fieldToExclude'
            }
        )
        let returnUpdateCategory = updatedCategory;
        if (categoryLogo) {
            //const fileExists = await checkFileExistance("categories",req.params.id,`logo_${sencondParseData.category_name}`,fileExtension);
            returnUpdateCategory = await updateCategoryLogo(req.params.id, sencondParseData.category_name, categoryLogo);
        }
        if (returnUpdateCategory) {
            res.json({
                message: "Category updated successfully!",
                data: returnUpdateCategory,
                error: false
            });
        } else {
            res.status(404).send({ message: "Data With given ID not found", error: true, statusCode: 404 });
        }
    } else {
        res.status(400).send({
            message: "Given ID not valid!",
            error: true,
            statusCode: 400
        })
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        await category.deleteOne({ _id: req.params.id })
        res.status(200).send({ message: "Category deleted successfully!", error: false, statusCode: 200 });
    } else {
        res.status(404).send({ message: "Data with given ID not found!", error: true, statusCode: 404 });
    }
});

const getAllCategories = asyncHandler(async (req, res)=>{
    const categoryData = await Category.find().select('-operational_group -category_code')
    if(categoryData.length){
        res.status(200).send({
            message: "category data successfully retrive!",
            data: categoryData,
            statusCode: 200
        })
    }else{
        res.status(404).send({
            message: "Data with given ID not found!", error: true, statusCode: 404
        })
    }
})

module.exports = {
    saveCategoryData,
    viewCategory,
    editCategory,
    deleteCategory,
    getAllCategories
}