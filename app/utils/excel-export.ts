import * as XLSX from 'xlsx';

interface TransactionExport {
  Date: string;
  Description: string;
  Amount: string;
  Vendor?: string;
  Category?: string;
  Source?: string;
  Status?: string;
  'Ledger Description'?: string;
  'Bank Description'?: string;
  'Match Score'?: string;
}

interface MatchedTransaction {
  date: string;
  amount: number;
  description: string;
  vendor?: string;
  matchScore?: number;
}

export const exportMatchedTransactions = (transactions: MatchedTransaction[], filename: string = 'matched-transactions') => {
  const data: TransactionExport[] = transactions.map(transaction => ({
    Date: formatDateForExcel(transaction.date),
    Description: transaction.description,
    'Ledger Description': transaction.vendor || transaction.description,
    'Bank Description': transaction.description,
    Amount: `$${Math.abs(transaction.amount).toFixed(2)}`,
    'Match Score': transaction.matchScore ? `${Math.round(transaction.matchScore)}%` : '100%'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Matched Transactions');

  // Auto-size columns
  const columnWidths = [
    { wch: 12 }, // Date
    { wch: 30 }, // Ledger Description
    { wch: 30 }, // Bank Description
    { wch: 12 }, // Amount
    { wch: 12 }  // Match Score
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

interface UnmatchedTransaction {
  date: string;
  amount: number;
  description: string;
  source: string;
  status: string;
  vendor?: string;
  category?: string;
}

export const exportUnmatchedTransactions = (transactions: UnmatchedTransaction[], filename: string = 'unmatched-transactions') => {
  const data: TransactionExport[] = transactions.map(transaction => ({
    Date: formatDateForExcel(transaction.date),
    Description: transaction.description,
    Source: transaction.source,
    Amount: `$${Math.abs(transaction.amount).toFixed(2)}`,
    Status: transaction.status === 'ledger-only' ? 'Ledger Only' : 'Bank Only',
    ...(transaction.vendor && { Vendor: transaction.vendor }),
    ...(transaction.category && { Category: transaction.category })
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Unmatched Transactions');

  // Auto-size columns
  const columnWidths = [
    { wch: 12 }, // Date
    { wch: 30 }, // Description
    { wch: 12 }, // Source
    { wch: 12 }, // Amount
    { wch: 15 }, // Status
    { wch: 20 }, // Vendor
    { wch: 20 }  // Category
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

const formatDateForExcel = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
};