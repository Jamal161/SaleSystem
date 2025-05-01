import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { createSale } from '../../services/saleService';
import { getProducts } from '../../services/productService';

const SaleForm = ({ onSave, onCancel }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    quantitySold: '1' // Default to minimum valid value
  });
  const [productDetails, setProductDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts(1, 1000);
        setProducts(response.data);
      } catch (error) {
        setErrors({ general: 'Failed to load products' });
      }
    };
    loadProducts();
  }, []);

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    
    setFormData({
      productId: productId.toString(),
      quantitySold: '1' // Reset quantity when product changes
    });

    setProductDetails(product);
    setErrors({});
  };

  const handleQuantityChange = (e) => {
    const quantity = Math.max(1, parseInt(e.target.value) || 1);
    setFormData(prev => ({
      ...prev,
      quantitySold: quantity.toString()
    }));
    setErrors(prev => ({ ...prev, quantitySold: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId) {
      newErrors.productId = 'Please select a product';
    }
    
    if (productDetails && parseInt(formData.quantitySold) > productDetails.stockQty) {
      newErrors.quantitySold = `Only ${productDetails.stockQty} units available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const saleData = {
        productId: parseInt(formData.productId),
        quantitySold: parseInt(formData.quantitySold),
        totalPrice: parseFloat((productDetails.price * parseInt(formData.quantitySold)).toFixed(2))
      };

      console.log('Submitting sale:', saleData);
      
      const response = await createSale(saleData);
      console.log('Sale created:', response.data);
      onSave();
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 400) {
        setErrors({
          ...error.response.data?.errors,
          general: error.response.data?.title || 'Please fix the highlighted fields'
        });
      } else {
        setErrors({
          general: error.message || 'Failed to record sale'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = productDetails 
    ? (productDetails.price * parseInt(formData.quantitySold || 0)).toFixed(2)
    : '0.00';

  return (
    <Form onSubmit={handleSubmit}>
      {errors.general && (
        <Alert variant="danger" dismissible onClose={() => setErrors({...errors, general: ''})}>
          {errors.general}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Product</Form.Label>
        <Form.Select
          name="productId"
          value={formData.productId}
          onChange={handleProductChange}
          isInvalid={!!errors.productId}
          disabled={isSubmitting}
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} (Stock: {product.stockQty}, Price: ${product.price.toFixed(2)})
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.productId}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          name="quantitySold"
          value={formData.quantitySold}
          onChange={handleQuantityChange}
          min="1"
          max={productDetails?.stockQty || 1}
          isInvalid={!!errors.quantitySold}
          disabled={!formData.productId || isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          {errors.quantitySold}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Available stock: {productDetails?.stockQty || 0}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Unit Price</Form.Label>
        <Form.Control
          plaintext
          readOnly
          value={`$${productDetails?.price.toFixed(2) || '0.00'}`}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Total Price</Form.Label>
        <Form.Control
          plaintext
          readOnly
          value={`$${totalPrice}`}
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button 
          variant="outline-secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isSubmitting || !formData.productId}
        >
          {isSubmitting ? (
            <>
              <Spinner as="span" size="sm" animation="border" />
              <span className="ms-2">Processing...</span>
            </>
          ) : 'Record Sale'}
        </Button>
      </div>
    </Form>
  );
};

export default SaleForm;