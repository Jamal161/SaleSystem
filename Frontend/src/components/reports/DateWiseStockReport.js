import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Alert } from 'react-bootstrap';
import { getDateWiseStockReport } from '../../services/reportService';

const DateWiseStockReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [formData, setFormData] = useState({
    fromDate: firstDay.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromDate || !formData.toDate) {
      setError('Please select both from and to dates.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await getDateWiseStockReport(formData.fromDate, formData.toDate);
      setReport(response.data);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5>Date-wise Stock Report</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Opening Stock</th>
              <th>Sold Quantity</th>
              <th>Closing Stock</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.openingStock}</td>
                <td>{item.totalSoldQuantity}</td>
                <td>{item.closingStock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default DateWiseStockReport;