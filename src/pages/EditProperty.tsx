import React, { useState, useEffect } from 'react';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, updateProperty, getProperty } = useProperty();
  const { user } = useAuth();

  const property = getProperty(id!);

  // Only allow owner to edit
  useEffect(() => {
    if (!property || property.sellerId !== user?._id) {
      navigate('/dashboard'); // redirect if not owner
    }
  }, [property, user, navigate]);

  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || 0,
    location: property?.location || '',
    address: property?.address || '',
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area: property?.area || 0,
    images: property?.images || [],
    amenities: property?.amenities || [],
    available: property?.available || true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProperty(id!, formData); // Update global state
    navigate('/landlord-dashboard');
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Bedrooms</label>
          <input
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Bathrooms</label>
          <input
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Area (sq ft)</label>
          <input
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* TODO: Add Images & Amenities Upload/Select */}

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default EditPropertyPage;
