import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content, Style, StyleDictionary } from 'pdfmake/interfaces';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    name: string;
    company: string;
    address: string;
    paymentmethod: string;
    expectedat: Date;
    status: string;
    price: number;
}

export const generateInvoice = (order: Order) => {
    // Format date
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calculate values
    const subtotal = order.price;
    const total = subtotal;

    // Create document definition
    const docDefinition: TDocumentDefinitions = {
        content: [
            // Header
            {
                columns: [
                    {
                        width: '*',
                        stack: [
                            { text: 'ECOGAS', style: 'companyName' },
                            { text: 'Phone:+91 8129112776,+91 9192349808' },
                            { text: 'Email: ecogas@gmail.com' }
                        ]
                    },
                    {
                        width: 160,
                        stack: [
                            { text: 'INVOICE', style: 'invoiceTitle' },
                            { 
                                text: `Invoice #: INV-${order._id.slice(-6)}`,
                                style: 'invoiceSubTitle'
                            },
                            { text: `Date: ${currentDate}`, style: 'invoiceSubTitle' }
                        ],
                        alignment: 'right'
                    }
                ]
            },
            
            // Spacing
            { text: '', margin: [0, 20] },

            // Billing Information
            {
                columns: [
                    {
                        width: '*',
                        stack: [
                            { text: 'Bill To:', style: 'subheader' },
                            { text: order.name, style: 'clientName' },
                            { text: order.company },
                            { text: order.address },
                            { text: `Payment Method: ${order.paymentmethod}` }
                        ]
                    },
                    {
                        width: '*',
                        stack: [
                            { text: 'Shipping Information:', style: 'subheader' },
                            { text: 'Expected Delivery:', style: 'label' },
                            { 
                                text: new Date(order.expectedat).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            },
                            { text: `Status: ${order.status}`, style: 'status' }
                        ]
                    }
                ]
            },

            // Spacing
            { text: '', margin: [0, 20] },

            // Items Table
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        // Header
                        [
                            { text: 'Description', style: 'tableHeader' },
                            { text: 'Quantity', style: 'tableHeader' },
                            { text: 'Price', style: 'tableHeader' },
                            { text: 'Amount', style: 'tableHeader' }
                        ],
                        // Items
                        [
                            'Shipping Service',
                            '1',
                            { text: `₹${order.price.toFixed(2)}`, alignment: 'right' },
                            { text: `₹${order.price.toFixed(2)}`, alignment: 'right' }
                        ]
                    ]
                }
            },

            // Spacing
            { text: '', margin: [0, 20] },

            // Summary
            {
                layout: 'noBorders',
                table: {
                    widths: ['*', 100],
                    body: [
                        [
                            { text: 'Subtotal:', alignment: 'right', style: 'summaryLabel' },
                            { text: `₹${subtotal.toFixed(2)}`, alignment: 'right' }
                        ],
                        [
                            { text: 'Total:', alignment: 'right', style: 'summaryTotal' },
                            { text: `₹${total.toFixed(2)}`, alignment: 'right', style: 'summaryTotal' }
                        ]
                    ]
                }
            },

            // Footer
            {
                text: 'Thank you for your business!',
                style: 'footer',
                margin: [0, 40, 0, 0]
            }
        ],
        
        styles: {
            companyName: {
                fontSize: 20,
                bold: true,
                color: '#2563eb'
            },
            invoiceTitle: {
                fontSize: 24,
                bold: true,
                color: '#2563eb',
                margin: [0, 0, 0, 10]
            },
            invoiceSubTitle: {
                fontSize: 12,
                margin: [0, 5, 0, 0]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 8]
            },
            clientName: {
                fontSize: 12,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            label: {
                fontSize: 10,
                color: '#666666',
                margin: [0, 4, 0, 2]
            },
            status: {
                fontSize: 11,
                color: '#059669',
                bold: true,
                margin: [0, 8, 0, 0]
            },
            tableHeader: {
                fillColor: '#2563eb',
                color: '#ffffff',
                bold: true,
                fontSize: 12,
                alignment: 'left'
            },
            summaryLabel: {
                fontSize: 12,
                bold: true
            },
            summaryTotal: {
                fontSize: 14,
                bold: true,
                color: '#2563eb'
            },
            footer: {
                alignment: 'center',
                italics: true,
                color: '#666666'
            }
        },
        
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40]
    };

    return pdfMake.createPdf(docDefinition);
};