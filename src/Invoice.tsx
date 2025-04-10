import { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';

const InvoiceTemplate = () => {
  // Reference for print functionality
  const printRef = useRef(null);

  const [companyName, setCompanyName] = useState('Your Company Name');
  const [companyAddress, setCompanyAddress] = useState('Your Business Address');
  const [companyCity, setCompanyCity] = useState('City');
  const [companyMobile, setCompanyMobile] = useState('Mobile Number');
  const [companyPostal, setCompanyPostal] = useState('Postal');
  
  const [billTo, setBillTo] = useState('Company Name');
  const [billAddress, setBillAddress] = useState('Address');
  const [billCity, setBillCity] = useState('City');
  const [billMobile, setBillMobile] = useState('Mobile Number');
  const [billPostal, setBillPostal] = useState('Postal');
  
  const [documentTitle, setDocumentTitle] = useState('INVOICE');
  const [orderDate, setOrderDate] = useState('12/01/23');
  const [dispatchDate, setDispatchDate] = useState('12/15/23');
  const [deliveryDate, setDeliveryDate] = useState('12/31/23');
  
  // Dynamic columns state
  const [columns, setColumns] = useState(['ITEM', 'QUANTITY', 'AMOUNT']);
  const [numColumns, setNumColumns] = useState(3);
  const [rows, setRows] = useState(2);
  
  // Generate initial items based on columns
  const generateEmptyItem = () => {
    const item:any = {};
    columns.forEach((col:any) => {
      item[col.toLowerCase()] = col === 'QUANTITY' ? 1 : '';
    });
    return item;
  };
  
  const [items, setItems] = useState(Array(2)?.fill(null).map(() => generateEmptyItem()));
  
  const [notes, setNotes] = useState('');
  const [total, setTotal] = useState('0.00');
  
  // New state for signature and stamp
  const [signatureName, setSignatureName] = useState('Authorized Signature');
  const [stampText, setStampText] = useState('Company Stamp/Seal');
  
  // Update columns when number changes
  const updateColumnCount = (newColumnCount :any) => {
    const count = parseInt(newColumnCount);
    if (count <= 0) return;
    
    // Ensure we have at least 3 columns and not more than 10
    const validCount = Math.min(Math.max(count, 3), 10);
    setNumColumns(validCount);
    
    // Create or trim columns array
    let newColumns = [...columns];
    
    if (validCount > columns.length) {
      // Add new columns
      for (let i = columns.length; i < validCount; i++) {
        newColumns.push(`Column ${i+1}`);
      }
    } else if (validCount < columns.length) {
      // Remove columns
      newColumns = newColumns.slice(0, validCount);
    }
    
    setColumns(newColumns);
    
    // Update items to match new column structure
    const updatedItems = items.map(item => {
      const newItem:any = {};
      newColumns.forEach((col:any) => {
        newItem[col.toLowerCase()] = item[col.toLowerCase()] || '';
      });
      return newItem;
    });
    
    setItems(updatedItems);
  };
  
  // Update column title
  const updateColumnTitle = (index:any, newTitle:any) => {
    const oldTitle = columns[index].toLowerCase();
    const newColumns = [...columns];
    newColumns[index] = newTitle.toUpperCase();
    setColumns(newColumns);
    
    // Update item keys to match new column title
    const updatedItems = items.map(item => {
      const newItem = { ...item };
      newItem[newTitle.toLowerCase()] = item[oldTitle] || '';
      delete newItem[oldTitle];
      return newItem;
    });
    
    setItems(updatedItems);
  };
  
  // Update rows when count changes
  const updateRows = (newRowCount:any) => {
    const rowCount = parseInt(newRowCount);
    if (rowCount <= 0) return;
    
    if (rowCount > items.length) {
      // Add new rows
      const newItems = [...items];
      for (let i = items.length; i < rowCount; i++) {
        newItems.push(generateEmptyItem());
      }
      setItems(newItems);
    } else if (rowCount < items.length) {
      // Remove rows
      setItems(items.slice(0, rowCount));
    }
    setRows(rowCount);
  };
  
  // Update item field value
  const updateItemField = (index:any, column:any, value:any) => {
    const newItems = [...items];
    newItems[index][column.toLowerCase()] = value;
    setItems(newItems);
  };

  // Handle printing with proper formatting
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()}, ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
    
    printWindow && printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${documentTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            color: #777;
            font-size: 14px;
          }
          
          .invoice-title {
            font-size: 24px;
            color: #777;
            margin-bottom: 20px;
          }
          
          .company-info {
            color: #777;
            margin-bottom: 40px;
          }
          
          .company-info p {
            margin: 5px 0;
          }
          
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          
          .bill-to {
            width: 48%;
          }
          
          .invoice-details {
            width: 48%;
            text-align: right;
          }
          
          .bill-to-title, .invoice-detail-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .bill-to p, .invoice-detail-value {
            margin: 5px 0;
          }
          
          .invoice-detail-label {
            color: #777;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          th {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #777;
            margin-top: 40px;
          }
          
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            margin-bottom: 30px;
          }
          
          .stamp-box, .signature-box {
            width: 45%;
            border: 1px dashed #aaa;
            height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            padding: 10px;
          }
          
          .signature-line {
            border-top: 1px solid #333;
            width: 80%;
            margin-bottom: 5px;
          }
          
          .total-section {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div>${formattedDate}</div>
            <div>BED LINENS</div>
          </div>
          
          <div class="invoice-title">${documentTitle}</div>
          
          <div class="company-info">
            <p>${companyName}</p>
            <p>${companyAddress}</p>
            <p>${companyCity}</p>
            <p>${companyMobile}</p>
            <p>${companyPostal}</p>
          </div>
          
          <div class="billing-section">
            <div class="bill-to">
              <div class="bill-to-title">BILL TO:</div>
              <p>${billTo}</p>
              <p>${billAddress}</p>
              <p>${billCity}</p>
              <p>${billMobile}</p>
              <p>${billPostal}</p>
            </div>
            
            <div class="invoice-details">
              <div class="invoice-detail-label">ORDER DATE</div>
              <div class="invoice-detail-value">${orderDate}</div>
              
              <div class="invoice-detail-label">DISPATCH DATE</div>
              <div class="invoice-detail-value">${dispatchDate}</div>
              
              <div class="invoice-detail-label">DELIVERY DATE</div>
              <div class="invoice-detail-value">${deliveryDate}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  ${columns.map(col => `
                    <td>${item[col.toLowerCase()] || ''}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${columns.includes('QUANTITY') && columns.includes('AMOUNT') ? `
            <div class="total-section">
              TOTAL: ₹${total}
            </div>
          ` : ''}
          
          ${notes ? `
            <div class="notes">
              <strong>NOTES:</strong>
              <p>${notes}</p>
            </div>
          ` : ''}
          
          <div class="signature-section">
            <div class="stamp-box">
              <div>${stampText}</div>
            </div>
            
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>${signatureName}</div>
            </div>
          </div>
          
          <div class="footer">
            <div>BED LINENS</div>
            <div>1/2</div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow && printWindow.document.close();
  };

  return (
    <Container fluid className="p-4">
      {/* Controls Section */}
      <Card className="mb-4 no-print">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Rows</Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  value={rows} 
                  onChange={(e) => updateRows(e.target.value)} 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Columns</Form.Label>
                <Form.Control 
                  type="number" 
                  min="3" 
                  max="10"
                  value={numColumns} 
                  onChange={(e) => updateColumnCount(e.target.value)} 
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button 
                variant="primary" 
                className="w-100" 
                onClick={handlePrint}
              >
                Print Invoice
              </Button>
            </Col>
          </Row>
          
          <Row>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Column Names</Form.Label>
                <Row>
                  {columns.map((col, index) => (
                    <Col key={index} md={Math.max(2, Math.floor(12 / columns.length))}>
                      <Form.Control 
                        type="text" 
                        value={col} 
                        onChange={(e) => updateColumnTitle(index, e.target.value)} 
                        className="mb-2"
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Invoice Template */}
      <div ref={printRef}>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between mb-3 text-muted small">
              <div>{new Date().toLocaleDateString() + ', ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div>BED LINENS</div>
            </div>
            
            <h3 className="text-muted mb-4">
              <Form.Control 
                type="text" 
                value={documentTitle} 
                onChange={(e) => setDocumentTitle(e.target.value)} 
                className="border-0 text-muted px-0 h3" 
              />
            </h3>
            
            <div className="text-muted mb-4">
              <div>
                <Form.Control 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  className="border-0 text-muted px-0" 
                />
              </div>
              <div>
                <Form.Control 
                  type="text" 
                  value={companyAddress} 
                  onChange={(e) => setCompanyAddress(e.target.value)} 
                  className="border-0 text-muted px-0" 
                  size="sm" 
                />
              </div>
              <div>
                <Form.Control 
                  type="text" 
                  value={companyCity} 
                  onChange={(e) => setCompanyCity(e.target.value)} 
                  className="border-0 text-muted px-0" 
                  size="sm" 
                />
              </div>
              <div>
                <Form.Control 
                  type="text" 
                  value={companyMobile} 
                  onChange={(e) => setCompanyMobile(e.target.value)} 
                  className="border-0 text-muted px-0" 
                  size="sm" 
                />
              </div>
              <div>
                <Form.Control 
                  type="text" 
                  value={companyPostal} 
                  onChange={(e) => setCompanyPostal(e.target.value)} 
                  className="border-0 text-muted px-0" 
                  size="sm" 
                />
              </div>
            </div>
            
            <Row className="mb-4 mt-5">
              <Col md={6}>
                <div className="fw-bold mb-2">BILL TO:</div>
                <div>
                  <Form.Control 
                    type="text" 
                    value={billTo} 
                    onChange={(e) => setBillTo(e.target.value)} 
                    className="border-0 px-0" 
                  />
                </div>
                <div>
                  <Form.Control 
                    type="text" 
                    value={billAddress} 
                    onChange={(e) => setBillAddress(e.target.value)} 
                    className="border-0 px-0" 
                    size="sm" 
                  />
                </div>
                <div>
                  <Form.Control 
                    type="text" 
                    value={billCity} 
                    onChange={(e) => setBillCity(e.target.value)} 
                    className="border-0 px-0" 
                    size="sm" 
                  />
                </div>
                <div>
                  <Form.Control 
                    type="text" 
                    value={billMobile} 
                    onChange={(e) => setBillMobile(e.target.value)} 
                    className="border-0 px-0" 
                    size="sm" 
                  />
                </div>
                <div>
                  <Form.Control 
                    type="text" 
                    value={billPostal} 
                    onChange={(e) => setBillPostal(e.target.value)} 
                    className="border-0 px-0" 
                    size="sm" 
                  />
                </div>
              </Col>
              <Col md={6} className="text-end">
                <div className="mb-2">
                  <div className="text-muted">ORDER DATE</div>
                  <Form.Control 
                    type="text" 
                    value={orderDate} 
                    onChange={(e) => setOrderDate(e.target.value)} 
                    className="border-0 text-end px-0" 
                  />
                </div>
                <div className="mb-2">
                  <div className="text-muted">DISPATCH DATE</div>
                  <Form.Control 
                    type="text" 
                    value={dispatchDate} 
                    onChange={(e) => setDispatchDate(e.target.value)} 
                    className="border-0 text-end px-0" 
                  />
                </div>
                <div className="mb-2">
                  <div className="text-muted">DELIVERY DATE</div>
                  <Form.Control 
                    type="text" 
                    value={deliveryDate} 
                    onChange={(e) => setDeliveryDate(e.target.value)} 
                    className="border-0 text-end px-0" 
                  />
                </div>
              </Col>
            </Row>
            
            <Table bordered responsive className="mt-4">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        <Form.Control 
                          type={column === 'QUANTITY' || column === 'AMOUNT' ? 'number' : 'text'}
                          value={item[column.toLowerCase()] || ''}
                          onChange={(e) => updateItemField(rowIndex, column, e.target.value)} 
                          className="border-0" 
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {/* Total row with manual input field */}
            {columns.includes('QUANTITY') && columns.includes('AMOUNT') && (
              <Row className="justify-content-end mt-3 mb-4">
                <Col md={4} className="text-end">
                  <div className="d-flex align-items-center justify-content-end">
                    <strong className="me-2">TOTAL: ₹</strong>
                    <Form.Control 
                      type="text" 
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      className="w-50 text-end"
                    />
                  </div>
                </Col>
              </Row>
            )}
            
            {/* Notes field */}
            <Form.Group className="mt-4">
              <Form.Label>NOTES:</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </Form.Group>
            
            {/* Signature and Stamp section */}
            <Row className="mt-5 mb-4">
              <Col md={6}>
                <div className="border border-1 border-dark-subtle p-3 text-center" style={{ minHeight: '100px' }}>
                  <Form.Control 
                    type="text" 
                    value={stampText} 
                    onChange={(e) => setStampText(e.target.value)} 
                    className="border-0 text-center mb-4" 
                    placeholder="Company Stamp/Seal" 
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex flex-column align-items-center" style={{ minHeight: '100px' }}>
                  <div className="mt-auto pt-5 w-100 border-top border-dark">
                    <Form.Control 
                      type="text" 
                      value={signatureName} 
                      onChange={(e) => setSignatureName(e.target.value)} 
                      className="border-0 text-center" 
                      placeholder="Authorized Signature" 
                    />
                  </div>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-between mt-4 text-muted small">
              <div>BED LINENS</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default InvoiceTemplate;