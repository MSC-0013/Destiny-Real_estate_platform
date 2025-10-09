import Property from "../models/Property.js";
import cloudinary from "../utils/cloudinary.js";

// Get all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create property with Cloudinary image upload
export const createProperty = async (req, res) => {
  try {
    const { images, ...propertyData } = req.body;
    
    // Upload images to Cloudinary
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.startsWith('data:image')) {
          const result = await cloudinary.uploader.upload(img, {
            folder: 'properties',
            transformation: [{ width: 1200, height: 800, crop: 'limit' }],
          });
          uploadedImages.push(result.secure_url);
        } else {
          uploadedImages.push(img);
        }
      }
    }

    const newProperty = new Property({
      ...propertyData,
      images: uploadedImages,
    });
    
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update property with Cloudinary image upload
export const updateProperty = async (req, res) => {
  try {
    const { images, ...propertyData } = req.body;
    
    // Upload new images to Cloudinary
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.startsWith('data:image')) {
          const result = await cloudinary.uploader.upload(img, {
            folder: 'properties',
            transformation: [{ width: 1200, height: 800, crop: 'limit' }],
          });
          uploadedImages.push(result.secure_url);
        } else {
          uploadedImages.push(img);
        }
      }
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { ...propertyData, images: uploadedImages.length > 0 ? uploadedImages : undefined },
      { new: true }
    );
    
    if (!updatedProperty) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) return res.status(404).json({ error: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
