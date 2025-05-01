import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Pagination, Modal } from 'react-bootstrap'; 
import { getSales } from '../../services/saleService';
import SaleForm from './SaleForm';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    loadSales();
  }, [currentPage]);

  const loadSales = async () => {
    try {
      const response = await getSales(currentPage, pageSize);
      setSales(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
    } catch (error) {
      console.error('Failed to load sales:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    loadSales();
    handleCloseModal();
  };

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Sales</h5>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Record Sale
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.product.name}</td>
                  <td>{sale.quantitySold}</td>
                  <td>${sale.totalPrice.toFixed(2)}</td>
                  <td>{new Date(sale.saleDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, sales.length)} of {sales.length} sales
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
          <Modal.Title>Record New Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SaleForm onSave={handleSave} onCancel={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SaleList;