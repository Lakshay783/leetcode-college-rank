"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, AlertCircle, CheckCircle2, ChevronLeft, Table as TableIcon, FileUp, Loader2 } from "lucide-react";
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
    <div className="mx-auto w-full max-w-5xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div>
        <Link href="/college" className="group mb-4 flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-semibold text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50">
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to Dashboard
        </Link>
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
               <FileUp className="h-5 w-5" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Bulk Student Import</h1>
           </div>
           <p className="ml-[52px] text-sm font-medium text-zinc-500 dark:text-zinc-400">
             Upload a comma-separated values (CSV) batch securely locked to your institution.
           </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-zinc-800/60 dark:bg-zinc-950/50">
        <label className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-12 transition-all hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/10">
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div className="mb-4 rounded-full bg-zinc-200/50 p-3 text-zinc-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400">
               <Upload className="h-8 w-8" />
            </div>
            <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              <span className="font-bold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop a CSV file here
            </p>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Columns Required: <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-zinc-700 font-mono dark:bg-zinc-800 dark:text-zinc-300">name</code>, <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-zinc-700 font-mono dark:bg-zinc-800 dark:text-zinc-300">collegeEmail</code>, <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-zinc-700 font-mono dark:bg-zinc-800 dark:text-zinc-300">department</code>, <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-zinc-700 font-mono dark:bg-zinc-800 dark:text-zinc-300">year</code>, <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-zinc-700 font-mono dark:bg-zinc-800 dark:text-zinc-300">leetcodeUsername</code>
            </p>
          </div>
          <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
        </label>
      </div>

      {isParsing && (
         <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Mapping CSV payload locally...</p>
         </div>
      )}

      {/* Preview Map */}
      {headers.length > 0 && !importResults && (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
           <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-200/60 bg-white/40 p-5 sm:flex-row sm:items-center dark:border-zinc-800/60 dark:bg-zinc-900/20">
             <div>
               <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  <TableIcon className="h-5 w-5"/> Detected Entries ({parsedRows.length})
               </h2>
               {hasMissingHeaders ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                     <AlertCircle className="h-4 w-4"/> Error: Exact Required Headers Missing
                  </p>
               ) : (
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-500">
                     <CheckCircle2 className="h-4 w-4"/> Schema strictly aligned and verified.
                  </p>
               )}
             </div>
             
             <button
                onClick={handleImport}
                disabled={isImporting || hasMissingHeaders || parsedRows.length === 0}
                className="group flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
             >
                {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isImporting ? "Processing Payload..." : "Confirm & Execute Import"}
             </button>
           </div>

           <div className="max-h-[400px] flex-1 overflow-x-auto overflow-y-auto p-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/90">
                 <tr>
                   <th className="w-12 px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">#</th>
                   {headers.map(h => (
                      <th key={h} className={`px-5 py-3.5 font-semibold ${REQUIRED_HEADERS.includes(h) ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}>{h}</th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                 {parsedRows.slice(0, 50).map((row, idx) => (
                   <tr key={idx} className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                     <td className="px-5 py-3 font-medium text-zinc-400">{idx + 1}</td>
                     {headers.map(h => (
                       <td key={h} className="px-5 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">{row[h] || <span className="text-zinc-300 dark:text-zinc-700">-</span>}</td>
                     ))}
                   </tr>
                 ))}
                 {parsedRows.length > 50 && (
                   <tr>
                     <td colSpan={headers.length + 1} className="bg-zinc-50/50 px-5 py-4 text-center text-sm font-medium italic text-zinc-500 dark:bg-zinc-900/20 dark:text-zinc-400">
                       Displaying first 50 entries of {parsedRows.length} total explicitly parsed bindings.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Upload Resolution Dashboard */}
      {importResults && (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-emerald-500/30 bg-white/60 shadow-sm backdrop-blur-xl dark:border-emerald-500/20 dark:bg-zinc-950/50">
           <div className="flex items-start gap-4 border-b border-emerald-500/20 bg-emerald-50/50 p-6 sm:p-8 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-500" />
              <div>
                 <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Ingestion Execution Completed</h2>
                 <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">Institutional records batch has been finalized entirely.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 gap-6 bg-white p-6 sm:p-8 md:grid-cols-2 dark:bg-zinc-900/20">
              <div className="flex flex-col justify-center rounded-xl border border-emerald-200/70 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-900/20">
                 <div className="text-4xl font-black text-emerald-600 dark:text-emerald-500">{importResults.successful}</div>
                 <div className="mt-1 text-sm font-bold text-emerald-800 dark:text-emerald-400">Valid Profiles Generated</div>
              </div>
              <div className={`flex flex-col justify-center rounded-xl border p-5 transition-colors ${importResults.failed > 0 ? "border-red-200/70 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20" : "border-zinc-200/70 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-900/40"}`}>
                 <div className={`text-4xl font-black ${importResults.failed > 0 ? "text-red-600 dark:text-red-500" : "text-zinc-400 dark:text-zinc-600"}`}>{importResults.failed}</div>
                 <div className={`mt-1 text-sm font-bold ${importResults.failed > 0 ? "text-red-800 dark:text-red-400" : "text-zinc-500 dark:text-zinc-500"}`}>Records Dropped</div>
              </div>
           </div>

           {importResults.errors && importResults.errors.length > 0 && (
             <div className="border-t border-zinc-200/60 bg-white p-6 sm:p-8 pt-6 dark:border-zinc-800/60 dark:bg-zinc-900/10">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-500"><AlertCircle className="h-4 w-4" /> Collision Log Execution Blocks ({importResults.errors.length} traces)</h3>
                <div className="max-h-60 space-y-1.5 overflow-y-auto rounded-xl border border-red-200 bg-red-50/50 p-5 font-mono text-[11px] font-medium leading-relaxed text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {importResults.errors.map((err: string, i: number) => (
                    <div className="pb-1" key={i}>{i+1}. {err}</div>
                  ))}
                </div>
             </div>
           )}
        </div>
      )}

    </div>
  );
}
