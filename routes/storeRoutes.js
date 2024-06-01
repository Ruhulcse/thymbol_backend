const express = require('express');
const router = express.Router();
const { protect, isShipper, isCarrier } = require("../middleware/auth");
const multer = require('../utils/multerConfig');

const {
    saveStoreData,
    viewStore,
    getWonerAllStore,
    editStore,
    deleteStore,
    getAllCategoryForDropDown,
    getSubCategoriesWithParentCatId
} = require('../controllers/store');
//router.route("/store/create-store").post(protect, createStore);
router.route('/store/create-store').post(
    protect,
    saveStoreData,
    // multer.fields([
    //     { name: 'logo', maxCount: 1 },
    //     { name: 'documents', maxCount: 10 }
    // ]),
    // handleFileUploads
);
router.route("/store/owner-stores/:id").get(protect,getWonerAllStore);
router.route("/store/categories").get(protect,getAllCategoryForDropDown);
router.route("/store/sub-categories/:id").get(protect,getSubCategoriesWithParentCatId);
router
    .route("/store/:id")
    .get(protect, viewStore)
    .put(protect, editStore)
    .delete(protect, deleteStore);

module.exports = router;