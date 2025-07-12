import React, { useState, useEffect } from "react";
import { apiFetch, apiUpload } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

export const FileUploadsPage: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>(`/upload?page=${page}&limit=${PAGE_SIZE}`);
      setFiles(res.data || []);
      setTotal(res.total || res.data?.length || 0);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [page]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      console.log('Uploading file:', file.name, file.size, file.type);
      const formData = new FormData();
      formData.append("file", file);
      console.log('FormData created, sending to API...');
      const res = await apiUpload<any>("/upload/file", formData, false); // Don't show error toast here
      console.log('Upload response:', res);
      toast.success("File uploaded!");
      fetchFiles();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || err?.toString() || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await apiFetch(`/upload/${id}`, { method: "DELETE" }, true, false); // Don't show error toast here
      toast.success("File deleted!");
      fetchFiles();
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to delete file");
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      {[...Array(6)].map((_, i) => <Skeleton key={i} height={60} className="mb-4" />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">File Uploads</h1>
        <div className="mb-6">
          <input type="file" onChange={handleFileChange} disabled={uploading} />
          {uploading && <span className="ml-2 text-yellow-500">Uploading...</span>}
        </div>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : files.length === 0 ? (
          <div className="text-gray-400">No files uploaded yet.</div>
        ) : (
          <div className="space-y-4">
            {files.map((file: any) => (
              <div key={file.id} className="flex items-center justify-between bg-[#15151a] border border-[#292932] rounded-lg p-4">
                <div>
                  <div className="text-white font-medium">{file.fileName}</div>
                  <div className="text-gray-300 text-xs">{file.fileType} • {(file.fileSize / 1024).toFixed(1)} KB</div>
                  <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#f34024] text-xs underline">View/Download</a>
                </div>
                <Button variant="destructive" onClick={() => handleDelete(file.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant="outline">Prev</Button>
          <span className=" px-2">Page {page}</span>
          <Button onClick={() => setPage(page + 1)} disabled={files.length < PAGE_SIZE} variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}; 