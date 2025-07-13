import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, FileTextIcon, ImageIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch, apiUpload } from "../../lib/api";
import ReactQuill from "react-quill";
// @ts-ignore
import "react-quill/dist/quill.snow.css";
import { Skeleton } from "../../components/ui/skeleton";
import toast from "react-hot-toast";
import { validateRequired, validateFileSize, validateFileType } from "../../lib/utils";

export const OrganizerPostCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: ""
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!validateFileSize(file, 5)) return; // 5MB limit
    if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/webp'])) return;

    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiUpload<{ status: boolean; data: { url: string } }>("/upload/file", formData, false, false);
      setBannerUrl(res.data.url);
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || err?.toString() || "Failed to upload image");
    } finally {
      setBannerUploading(false);
    }
  };

  const validate = () => {
    const errors: any = {};
    if (!formData.title || formData.title.length < 2) errors.title = ["Title must be at least 2 characters."];
    if (!formData.content || formData.content.length < 10) errors.content = ["Content must be at least 10 characters."];
    if (bannerUrl && !/^https?:\/\/.+/.test(bannerUrl)) errors.imageUrl = ["Image URL must be a valid URL."];
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Form validation
    if (!validateRequired(formData.title, "Post title")) return;
    if (!validateRequired(formData.content, "Post content")) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        imageUrl: bannerUrl || undefined
      };
      
      await apiFetch("/pending/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      }, true, false, false);
      
      toast.success("Post created successfully! It will be reviewed by admin before being visible to players.");
      navigate("/organizer/posts");
    } catch (err: any) {
      if (err && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-8">
      <Skeleton height={40} width={300} className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={100} className="mb-4" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1e] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate("/organizer")}
                variant="outline"
                className="border-[#292932] hover:text-white hover:bg-[#292932]"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Create Post</h1>
                <p className="text-gray-400">Create a new news post or announcement</p>
              </div>
            </div>
            
            <Button 
              form="post-form"
              type="submit"
              disabled={isSubmitting}
              className="bg-[#f34024] hover:bg-[#f34024]/90 text-white"
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </div>

          <form id="post-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Post Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Post Title *
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter post title"
                        className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                        required
                      />
                      {fieldErrors.title && fieldErrors.title.map((err: string, idx: number) => (
                        <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Content *</label>
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={val => setFormData(prev => ({ ...prev, content: val }))}
                        className="bg-[#19191d] text-white"
                        placeholder="Write your post content..."
                      />
                      {fieldErrors.content && fieldErrors.content.map((err: string, idx: number) => (
                        <div key={idx} className="text-xs text-red-500 mt-1">{err}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Featured Image */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    <ImageIcon className="w-5 h-5 inline mr-2" />
                    Featured Image
                  </h3>
                  
                  <div className="border-2 border-dashed border-[#292932] rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Upload featured image</p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-[#19191d] border-[#292932] text-white focus:border-[#f34024]"
                      onChange={handleBannerUpload}
                      disabled={bannerUploading}
                    />
                    {bannerUploading && <p className="text-yellow-500 text-xs mt-2">Uploading...</p>}
                    {bannerUrl && <img src={bannerUrl} alt="Image Preview" className="mt-2 rounded-lg max-h-32 mx-auto" />}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="bg-[#15151a] border-[#292932]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Title:</span>
                      <span className="text-white">{formData.title || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Content Length:</span>
                      <span className="text-white">{formData.content.length} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Image:</span>
                      <span className="text-white">{bannerUrl ? "Uploaded" : "Not set"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-blue-900/20 border-blue-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-blue-400 mb-4">💡 Tips</h3>
                  <ul className="text-blue-300 text-sm space-y-2">
                    <li>• Write engaging headlines</li>
                    <li>• Include relevant images</li>
                    <li>• Keep content clear and concise</li>
                    <li>• Use proper formatting</li>
                    <li>• All posts require admin approval</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 