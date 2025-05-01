import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Pagination, Card, Modal } from 'react-bootstrap';
import { getProducts, deleteProduct } from '../../services/productService';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm]);

  const loadProducts = async () => {
    try {
      const response = await getProducts(currentPage, pageSize, searchTerm);
      setProducts(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSave = () => {
    loadProducts();
    handleCloseModal();
  };

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Products</h5>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Product
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by name or SKU"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku || '-'}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stockQty}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, products.length)} of {products.length} products
            </div>
            <Pagination>
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct ? 'Edit Product' : 'Add Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            product={selectedProduct}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductList;