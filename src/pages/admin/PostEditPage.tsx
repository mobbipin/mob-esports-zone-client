import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

import { apiFetch, apiUpload } from "../../lib/api";
// @ts-ignore
import ReactQuill from "react-quill";
// @ts-ignore
import "react-quill/dist/quill.snow.css";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";

export const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<any>(`/posts/${id}`);
        setForm(res.data || {});
        setImageUrl(res.data?.imageUrl || "");
      } catch (err: any) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (val: string) => {
    setForm((prev: any) => ({ ...prev, content: val }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/file", formDataUpload);
      setImageUrl(res.data.url);
      setForm((prev: any) => ({ ...prev, imageUrl: res.data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl || imageUrl || undefined
        })
      });
      toast.success("Post updated successfully!");
      navigate("/admin/posts");
    } catch (err: any) {
      setError(err.message || err?.toString() || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Edit Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title</label>
              <Input name="title" value={form.title || ""} onChange={handleChange} required className="bg-[#19191d] border-[#292932] text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Content</label>
              <div className="bg-[#19191d] border border-[#292932] rounded-md">
                {/* @ts-ignore */}
                <ReactQuill
                  theme="snow"
                  value={form.content || ""}
                  onChange={handleContentChange}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  className="text-white min-h-[200px]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={imageUploading} />
              {imageUploading && <p className="text-yellow-500 text-xs mt-2">Uploading...</p>}
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 rounded-lg max-h-32" />}
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" onClick={() => navigate("/admin/posts")} variant="outline" className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]">
                Cancel
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 