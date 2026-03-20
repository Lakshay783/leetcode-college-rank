"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, AlertCircle, CheckCircle2, ChevronLeft, Table as TableIcon } from "lucide-react";
import Link from "next/link";

export default function CsvImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const REQUIRED_HEADERS = ["name", "collegeEmail", "department", "year", "leetcodeUsername"];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setIsParsing(true);
    setImportResults(null);

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setParsedRows(results.data);
        setIsParsing(false);
      },
      error: (err) => {
        alert("Error parsing CSV: " + err.message);
        setIsParsing(false);
      }
    });
  };

  const handleImport = async () => {
    // Basic verification natively preventing doomed payloads
    const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h));
    if (missing.length > 0) {
       alert(`Missing exactly bound required columns: \n${missing.join(", ")}\n\nPlease ensure your CSV header row matches exactly.`);
       return;
    }

    setIsImporting(true);
    try {
      const res = await fetch("/api/college/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Import failed");
      
      setImportResults(data.results);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsImporting(false);
    }
  };

  const hasMissingHeaders = headers.length > 0 && REQUIRED_HEADERS.some(h => !headers.includes(h));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/college" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Import Students</h1>
        <p className="text-muted-foreground">Upload a CSV batch purely bound to your institution.</p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-foreground"><span className="font-semibold">Click to upload</span> or drag and drop a CSV file</p>
            <p className="text-xs text-muted-foreground">Headers Required: name, collegeEmail, department, year, leetcodeUsername</p>
          </div>
          <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
        </label>
      </div>

      {isParsing && <p className="text-center font-medium animate-pulse">Parsing CSV purely in browser...</p>}

      {headers.length > 0 && !importResults && (
        <div className="bg-card border rounded-lg shadow-sm flex flex-col overflow-hidden">
           <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div>
               <h2 className="text-lg font-bold flex items-center gap-2"><TableIcon className="w-5 h-5"/> Preview Parsed Rows ({parsedRows.length})</h2>
               {hasMissingHeaders ? (
                  <p className="text-destructive text-sm font-medium mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Missing exact required headers!</p>
               ) : (
                  <p className="text-green-600 dark:text-green-500 text-sm font-medium mt-1 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> CSV mapping looks good.</p>
               )}
             </div>
             <button
                onClick={handleImport}
                disabled={isImporting || hasMissingHeaders || parsedRows.length === 0}
                className="flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-medium"
             >
                {isImporting ? "Processing Bulk Import..." : "Confirm & Import Batch"}
             </button>
           </div>

           <div className="overflow-x-auto max-h-[400px]">
             <table className="w-full text-sm text-left whitespace-nowrap">
               <thead className="bg-muted/30 sticky top-0">
                 <tr>
                   <th className="p-3 font-medium text-muted-foreground w-12">#</th>
                   {headers.map(h => (
                      <th key={h} className={`p-3 font-medium ${REQUIRED_HEADERS.includes(h) ? "text-primary font-bold" : "text-muted-foreground"}`}>{h}</th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y relative">
                 {parsedRows.slice(0, 50).map((row, idx) => (
                   <tr key={idx} className="hover:bg-muted/10">
                     <td className="p-3 text-muted-foreground">{idx + 1}</td>
                     {headers.map(h => (
                       <td key={h} className="p-3 font-mono text-xs">{row[h] || "-"}</td>
                     ))}
                   </tr>
                 ))}
                 {parsedRows.length > 50 && (
                   <tr>
                     <td colSpan={headers.length + 1} className="p-4 text-center text-muted-foreground italic bg-muted/5 font-medium">
                       Showing first 50 rows of {parsedRows.length} total explicitly parsed bindings.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {importResults && (
        <div className="bg-card border rounded-lg shadow-sm flex flex-col overflow-hidden border-primary/20">
           <div className="p-6 border-b bg-primary/5 flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                 <h2 className="text-xl font-bold">Import Processing Concluded</h2>
                 <p className="text-muted-foreground mt-1">Your batch request strictly bound to your institutional schema has finished.</p>
              </div>
           </div>
           
           <div className="p-6 grid grid-cols-2 gap-6 bg-muted/5">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md">
                 <div className="text-3xl font-black text-green-600 dark:text-green-500">{importResults.successful}</div>
                 <div className="text-sm font-semibold text-green-700 dark:text-green-400 mt-1">Successfully Imported Students</div>
              </div>
              <div className={`p-4 rounded-md border ${importResults.failed > 0 ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" : "bg-muted/50 border-input"}`}>
                 <div className={`text-3xl font-black ${importResults.failed > 0 ? "text-red-500" : "text-muted-foreground"}`}>{importResults.failed}</div>
                 <div className="text-sm font-semibold mt-1">Failed to Import</div>
              </div>
           </div>

           {importResults.errors && importResults.errors.length > 0 && (
             <div className="p-6 pt-2">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-red-500"><AlertCircle className="w-4 h-4" /> Collision Log ({importResults.errors.length} traces)</h3>
                <div className="bg-destructive/10 text-destructive text-xs font-mono p-4 rounded-md max-h-60 overflow-y-auto space-y-1">
                  {importResults.errors.map((err: string, i: number) => (
                    <div key={i}>{err}</div>
                  ))}
                </div>
             </div>
           )}
        </div>
      )}

    </div>
  );
}
