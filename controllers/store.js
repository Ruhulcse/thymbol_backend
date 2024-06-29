const asyncHandler = require("express-async-handler");
const Store = require("../models/storeModel");
const multer = require("../utils/multerConfig");
const path = require("path");
const { uploadToS3 } = require("../utils/functions");
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");

const saveStoreData = async (req, res) => {
  const storeLogo = req.files.logo;
  const storeDocuments = req.files.documents;
  let storeData;
  if (req.body.jsonData) {
    try {
      storeData = JSON.parse(req.body.jsonData);
    } catch (jsonErr) {
      console.error(jsonErr);
      return res.status(400).json({ error: "Invalid JSON data" });
    }
  }
  const sencondParseData = JSON.parse(storeData);
  //console.log('sencondParseData', sencondParseData);
  const {
    store_name,
    category,
    address,
    website_link,
    social_media_link,
    business_hours,
    location,
  } = sencondParseData;
  const owner = req.user._id;
  // Validate JSON data against the schema
  const newStore = new Store({
    owner,
    store_name,
    category,
    address,
    website_link,
    social_media_link,
    business_hours,
    location,
  });

  try {
    // Save the store to get the store ID
    const savedStore = await newStore.save();
    req.storeId = savedStore._id;
    let returnUpdateStore = savedStore;
    if (storeLogo) {
      const updatedLogoDetails = await updateStoreLogo(
        savedStore._id,
        storeLogo
      );
      returnUpdateStore = updatedLogoDetails;
    }
    if (storeDocuments) {
      const updateStroeWithDoc = await updateStoreDocuments(
        savedStore._id,
        storeDocuments
      );
      returnUpdateStore = updateStroeWithDoc;
    }

    res.status(201).send({
      data: returnUpdateStore,
      message: "Store Successfully Creted!",
      statusCode: 201,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(501).send({
      error: true,
      data: [],
      statusCode: 501,
      message: "Error Found! Can not create store!",
    });
  }
};

const updateStoreLogo = async (storeId, file) => {
  const filetypes = /jpeg|jpg|png|pdf|docx/;
  const extname = filetypes.test(path.extname(file.name).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  const fileExtension = file.mimetype.split("/")[1];
  const directory = "stores";
  const timestamp = Date.now();
  const logoFilePath = `${directory}/${storeId}/logo_${timestamp}.${fileExtension}`;
  if (mimetype && extname) {
    const result = await uploadToS3(file, logoFilePath);
    if (result) {
      const logoDetails = {
        filePath: result.Location,
        fileType: file.mimetype,
        fileName: file.name,
      };
      const updatedStore = await Store.findByIdAndUpdate(
        storeId,
        { logo: logoDetails },
        { new: true }
      );
      return updatedStore;
    } else {
      throw new Error("Can not update store logo!");
    }
  } else {
    throw new Error("Invalid file type!");
  }
};
const updateStoreDocuments = async (storeId, documentsFile) => {
  const directory = "stores";
  let documents = [];
  const filetypes = /jpeg|jpg|png|pdf|docx/;
  try {
    if (Array.isArray(documentsFile)) {
      for (let i = 0; i <= documentsFile.length; i++) {
        let singleFile = documentsFile[0];
        const extname = filetypes.test(
          path.extname(singleFile.name).toLowerCase()
        );
        const mimetype = filetypes.test(singleFile.mimetype);
        if (mimetype && extname) {
          let fileExtension = singleFile.mimetype.split("/")[1];
          let timestamp = Date.now();
          let filePath = `${directory}/${storeId}/document_${timestamp}.${fileExtension}`;
          const result = await uploadToS3(singleFile, filePath);
          if (result) {
            let tempObj = {
              filePath: result.Location,
              fileType: singleFile.mimetype,
              fileName: singleFile.name,
            };
            documents.push(tempObj);
          }
        } else {
          throw new Error("Invalid file type!");
        }
      }
    } else {
      let singleFile = documentsFile;
      const extname = filetypes.test(
        path.extname(singleFile.name).toLowerCase()
      );
      const mimetype = filetypes.test(singleFile.mimetype);
      if (mimetype && extname) {
        let fileExtension = singleFile.mimetype.split("/")[1];
        let timestamp = Date.now();
        let filePath = `${directory}/${storeId}/document_${timestamp}.${fileExtension}`;
        const result = await uploadToS3(singleFile, filePath);
        if (result) {
          let tempObj = {
            filePath: result.Location,
            fileType: singleFile.mimetype,
            fileName: singleFile.name,
          };
          documents.push(tempObj);
        }
      } else {
        throw new Error("Invalid file type!");
      }
    }
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { documents: documents },
      { new: true }
    );
    return updatedStore;
  } catch (err) {
    throw new Error("Error Found! Can not update store documents!");
  }
};

// const createStore = async (req, res) => {

//     uploadFiles(req, res, async function (err) {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'File upload error' });
//         }

//         const { jsonData } = req.body;

//         let storeData;
//         try {
//             storeData = JSON.parse(jsonData);
//         } catch (jsonErr) {
//             console.error(jsonErr);
//             return res.status(400).json({ error: 'Invalid JSON data' });
//         }
//         console.log("storeData", storeData);
//         let secondParseStoreData = JSON.parse(storeData);
//         const { store_name, category, sub_category, address,
//             website_link, social_media_link, business_hours,
//             location } = secondParseStoreData;

//         // Validate JSON data against the schema
//         const newStore = new Store({
//             store_name,
//             category,
//             sub_category,
//             address,
//             website_link,
//             social_media_link,
//             business_hours,
//             location
//         });

//         try {
//             // Save the store to get the store ID
//             const savedStore = await newStore.save();
//             req.storeId = savedStore._id;

//             const uploadFiles = multer.fields([
//                 { name: 'logo', maxCount: 1 },
//                 { name: 'documents', maxCount: 10 }
//             ]);

//             // Handle file uploads
//             const logo = req.files && req.files.logo ? req.files.logo[0] : null;
//             const documents = req.files && req.files.documents ? req.files.documents : [];

//             // if (!logo) {
//             //     return res.status(400).json({ error: 'Logo file is required' });
//             // }

//             const logoDetails = {
//                 filePath: logo.path,
//                 fileType: logo.mimetype,
//                 fileName: logo.originalname
//             };

//             const documentDetails = documents.map(file => ({
//                 filePath: file.path,
//                 fileType: file.mimetype,
//                 fileName: file.originalname
//             }));

//             savedStore.logo = logoDetails;
//             savedStore.documents = documentDetails;

//             await savedStore.save();

//             res.status(201).send({ message: "Store Successfully Created!", data: savedStore, error: false });
//         } catch (err) {
//             console.error(err);
//             res.status(501).send({ error: true, message: "Error Found! Can not create store!", data: [] });
//         }
//     });
// };

const viewStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (store) {
    res.status(200).send({
      data: store,
      message: "Store Data Successfully Retrieve!",
      error: false,
    });
  } else {
    res.status(404).send({
      data: [],
      message: "Data with given ID not found!",
      error: true,
    });
  }
});

const getWonerAllStore = asyncHandler(async (req, res) => {
  console.log("req.params.owner_id", req.params.id);
  const wonerStores = await Store.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.params.id), // Convert owner ID to ObjectId
      },
    },
    {
      $lookup: {
        from: "categories", // The name of the category collection
        localField: "category", // The field in the store collection
        foreignField: "_id", // The field in the category collection
        as: "categoryInfo", // The name of the array field to add
      },
    },
    {
      $addFields: {
        categoryInfo: {
          $cond: {
            if: { $eq: [{ $size: "$categoryInfo" }, 0] },
            then: [{}], // Insert an empty object if there are no matching categories
            else: "$categoryInfo",
          },
        },
      },
    },
    {
      $unwind: {
        path: "$categoryInfo",
        preserveNullAndEmptyArrays: true, // Preserve stores without matching categories
      },
    },
    {
      $addFields: {
        store_address: {
          $concat: [
            "$address.street",
            ", ",
            "$address.city",
            ", ",
            "$address.postal_code",
            ", ",
            "$address.country",
          ],
        },
        category_name: {
          $ifNull: ["$categoryInfo.category_name", ""],
        }, // Add the category name to the result
      },
    },
    {
      $project: {
        address: 0, // Exclude the original address field
        categoryInfo: 0, // Exclude the categoryInfo field
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
  if (wonerStores) {
    res.status(200).send({
      data: wonerStores,
      message: "Store Data Successfully Retrieve!",
      error: false,
    });
  } else {
    console.log("req.params.owner_id", req.params.id);
    res.status(404).send({
      data: [],
      message: "Data with given ID not found!",
      error: true,
    });
  }
});

const editStore = asyncHandler(async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const updatedStore = await Store.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      },
      {
        returnDocument: "after", // Return the updated document
        //projection: { password: 0 } // Exclude 'fieldToExclude'
      }
    );
    if (updatedStore) {
      res.json({
        message: "Store updated successfully!",
        data: updatedStore,
        error: false,
      });
    } else {
      res.status(404).send({
        message: "Data With given ID not found",
        error: true,
        statusCode: 404,
      });
    }
  } else {
    res.status(400).send({
      message: "Given ID not valid!",
      error: true,
      statusCode: 400,
    });
  }
});

const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (store) {
    await Store.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Store deleted successfully!",
      error: false,
      statusCode: 200,
    });
  } else {
    res.status(404).send({
      message: "Data with given ID not found!",
      error: true,
      statusCode: 404,
    });
  }
});

const getAllCategoryForDropDown = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    {
      $project: {
        label: "$category_name",
        value: "$_id",
        _id: 0,
      },
    },
  ]).exec();
  if (categories) {
    res.status(200).send({
      message: "Successfully Retrive Category Info!",
      error: false,
      data: categories,
    });
  } else {
    res
      .status(404)
      .send({ message: "Categories not found!", error: true, data: [] });
  }
});

const getSubCategoriesWithParentCatId = asyncHandler(async (req, res) => {
  const subCategories = await Subcategory.aggregate([
    {
      $match: {
        parent_category_id: new mongoose.Types.ObjectId(req.params.id), // Convert category ID to ObjectId
      },
    },
    {
      $project: {
        label: "$sub_category_name",
        value: "$_id",
        _id: 0,
      },
    },
  ]).exec();
  if (subCategories) {
    res.status(200).send({
      message: "Successfully Retrive Sub Category Info!",
      error: false,
      data: subCategories,
    });
  } else {
    res
      .status(404)
      .send({ message: "Categories not found!", error: true, data: [] });
  }
});

module.exports = {
  saveStoreData,
  viewStore,
  getWonerAllStore,
  editStore,
  deleteStore,
  getAllCategoryForDropDown,
  getSubCategoriesWithParentCatId,
};
