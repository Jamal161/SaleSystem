import React, { useState, useEffect } from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import { getCurrentStockReport } from '../../services/reportService';

const CurrentStockReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await getCurrentStockReport();
      setReport(response.data);
    } catch (error) {
      console.error('Failed to load current stock report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Current Stock Report</h5>
        <Button variant="primary" size="sm" onClick={loadReport} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.sku || '-'}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.currentStockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CurrentStockReport;