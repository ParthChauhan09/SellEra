
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productApi } from '@/services/api';
import { toast } from 'sonner';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    qty: '1'
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Fetch product data if editing
  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      try {
        const response = await productApi.getProductById(id);
        const product = response.data;
        
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          qty: product.qty?.toString() || '1'
        });
        
        if (product.image?.url) {
          setImagePreview(product.image.url);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
        navigate('/vendor/dashboard');
      }
    };
    
    fetchProductData();
  }, [id, isEditing, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate price is a number
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      // Create form data object for API
      const productFormData = new FormData();
      productFormData.append('product[name]', formData.name);
      productFormData.append('product[description]', formData.description);
      productFormData.append('product[price]', formData.price);
      productFormData.append('product[category]', formData.category);
      productFormData.append('product[qty]', formData.qty);
      
      if (image) {
        productFormData.append('product[image]', image);
      }
      
      if (isEditing) {
        await productApi.updateProduct(id, productFormData);
        toast.success('Product updated successfully');
      } else {
        await productApi.createProduct(productFormData);
        toast.success('Product created successfully');
      }
      
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(isEditing ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-10 bg-gray-200 rounded w-full" />
                
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-32 bg-gray-200 rounded w-full" />
                
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Update your product information' 
                  : 'Create a new product to sell on SellEra'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={5}
                    required
                  />
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity*</Label>
                  <Input
                    id="qty"
                    name="qty"
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={handleChange}
                    placeholder="Quantity in stock"
                    required
                  />
                </div>
                
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label htmlFor="image">Product Image {isEditing ? '(Leave empty to keep current)' : '*'}</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!isEditing}
                  />
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                      <div className="w-32 h-32 border rounded overflow-hidden bg-gray-50">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/vendor/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-sellera-purple hover:bg-sellera-purple-dark"
                    disabled={submitLoading}
                  >
                    {submitLoading 
                      ? (isEditing ? 'Updating...' : 'Creating...') 
                      : (isEditing ? 'Update Product' : 'Create Product')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProductForm;
