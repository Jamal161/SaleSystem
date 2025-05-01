import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createProduct, updateProduct } from '../../services/productService';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price || '',
    stockQty: product?.stockQty || '',
    description: product?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQty: parseInt(formData.stockQty),
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }
      onSave();
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}
      
      <Form.Group className="mb-3">
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>SKU Code (optional)</Form.Label>
        <Form.Control
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          isInvalid={!!errors.sku}
        />
        <Form.Control.Feedback type="invalid">
          {errors.sku}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          isInvalid={!!errors.price}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.price}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Stock Quantity</Form.Label>
        <Form.Control
          type="number"
          name="stockQty"
          value={formData.stockQty}
          onChange={handleChange}
          isInvalid={!!errors.stockQty}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.stockQty}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description (optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;