import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { apiFetch } from "../../lib/api";
// @ts-ignore
import ReactQuill from "react-quill";
// @ts-ignore
import "react-quill/dist/quill.snow.css";

export const PostViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<any>(`/posts/${id}`);
        setPost(res.data || null);
      } catch (err: any) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading post...</div>;
  if (error || !post) return <div className="text-center py-12 text-red-500">{error || "Post not found"}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="bg-[#15151a] border-[#292932]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{post.title}</h2>
            <Button onClick={() => navigate(-1)} variant="outline" className="border-[#292932] text-white">Back</Button>
          </div>
          <div className="mb-4 text-gray-400">{post.createdAt && (<span>Created: {post.createdAt}</span>)}</div>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" className="mb-4 rounded-lg max-h-64 mx-auto" />}
          <div className="mb-4">
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 