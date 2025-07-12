import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import { apiFetch, apiUpload } from "../../lib/api";
import toast from "react-hot-toast";
// @ts-ignore
import ReactQuill from "react-quill";
// @ts-ignore
import "react-quill/dist/quill.snow.css";

interface PostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  post?: any; // For editing
  isEditing?: boolean;
}

export const PostDialog: React.FC<PostDialogProps> = ({
  open,
  onClose,
  onSubmit,
  post,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: ""
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (post && isEditing) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        imageUrl: post.imageUrl || ""
      });
      setImageUrl(post.imageUrl || "");
    } else {
      setFormData({
        title: "",
        content: "",
        imageUrl: ""
      });
      setImageUrl("");
    }
  }, [post, isEditing, open]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/file", formDataUpload);
      setImageUrl(res.data.url);
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Post title is required");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Post content is required");
      return;
    }

    onSubmit({
      ...formData,
      imageUrl: formData.imageUrl || imageUrl
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#15151a] border-[#292932] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title *</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title"
                className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Content *</label>
              <div className="bg-[#19191d] border border-[#292932] rounded-md">
                {/* @ts-ignore */}
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(val: string) => setFormData(prev => ({ ...prev, content: val }))}
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Featured Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageUploading}
                  className="text-gray-400"
                />
                {imageUploading && <span className="text-yellow-500 text-sm">Uploading...</span>}
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Preview" className="rounded-lg max-h-32 object-cover" />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-[#f34024] hover:bg-[#f34024]/90 text-white">
                {isEditing ? "Update Post" : "Create Post"}
              </Button>
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-[#292932] hover:text-white hover:bg-[#292932]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 