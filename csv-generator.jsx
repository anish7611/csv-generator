const { useState } = React;

// Inline Lucide React icons
const Download = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const Plus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Trash2 = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const Edit2 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const Check = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const X = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

function CSVGenerator() {
  const [columns, setColumns] = useState(['Column 1', 'Column 2', 'Column 3']);
  const [rows, setRows] = useState([
    ['', '', ''],
    ['', '', '']
  ]);
  const [editingColumn, setEditingColumn] = useState(null);
  const [tempColumnName, setTempColumnName] = useState('');

  const addColumn = () => {
    setColumns([...columns, `Column ${columns.length + 1}`]);
    setRows(rows.map(row => [...row, '']));
  };

  const removeColumn = (index) => {
    if (columns.length === 1) return;
    setColumns(columns.filter((_, i) => i !== index));
    setRows(rows.map(row => row.filter((_, i) => i !== index)));
  };

  const startEditColumn = (index) => {
    setEditingColumn(index);
    setTempColumnName(columns[index]);
  };

  const saveColumnName = (index) => {
    const newColumns = [...columns];
    newColumns[index] = tempColumnName || `Column ${index + 1}`;
    setColumns(newColumns);
    setEditingColumn(null);
  };

  const cancelEditColumn = () => {
    setEditingColumn(null);
    setTempColumnName('');
  };

  const addRow = () => {
    setRows([...rows, Array(columns.length).fill('')]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const escapeCSVValue = (value) => {
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const generateCSV = () => {
    const csvContent = [
      columns.map(escapeCSVValue).join(','),
      ...rows.map(row => row.map(escapeCSVValue).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setColumns(['Column 1', 'Column 2', 'Column 3']);
    setRows([['', '', ''], ['', '', '']]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">CSV Generator</h1>
            <div className="flex gap-3">
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={generateCSV}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download size={20} />
                Download CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 w-12">#</th>
                  {columns.map((col, index) => (
                    <th key={index} className="border border-gray-300 p-2 min-w-48">
                      {editingColumn === index ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempColumnName}
                            onChange={(e) => setTempColumnName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveColumnName(index);
                              if (e.key === 'Escape') cancelEditColumn();
                            }}
                            className="flex-1 px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                          />
                          <button
                            onClick={() => saveColumnName(index)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEditColumn}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-700">{col}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditColumn(index)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => removeColumn(index)}
                              className="text-red-600 hover:text-red-700"
                              disabled={columns.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 w-12">
                    <button
                      onClick={addColumn}
                      className="text-green-600 hover:text-green-700"
                      title="Add column"
                    >
                      <Plus size={20} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-center text-gray-500 font-medium">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          placeholder="Enter value"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-600 hover:text-red-700"
                        disabled={rows.length === 1}
                        title="Delete row"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              Add Row
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">How to Use</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Click on column headers to edit their names</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Use the + button in the header to add more columns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Click "Add Row" to insert new rows</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Fill in your data in the table cells</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Click "Download CSV" to save your data as a CSV file</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
