import React, { useState } from 'react';
import { CreatePostModal } from '../components/CreatePostModal';
import { Button } from "@/shared/components/ui/button";

export const CreatePostPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Social Media Manager
            </h1>
            
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-700 mb-4">
                Ready to create your next post?
              </h2>
              <p className="text-gray-500 mb-8">
                Use our AI-powered tools to create engaging content for your social media platforms.
              </p>
              
              <Button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 text-lg"
              >
                Create New Post
              </Button>
            </div>
          </div>
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
  );
};
