import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { SendHorizonal, Sparkles } from "lucide-react";
import { useState } from "react";
import PostTypeSelector from "@/modules/creation-studio/components/dropdown/post-type-selector";
import SocialMediaSelector from "../dropdown/social-media-selector";
import PostToneSelector from "../dropdown/post-tone-selector";
import ToolsSelector from "../dropdown/tools-selector";

const BottomNavbar = () => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 flex flex-col items-center z-[1000] pointer-events-none">
      <div className="w-full max-w-3xl flex flex-col gap-4 pointer-events-auto">
        <div className="w-full bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-start py-3 border-b border-outline-variant/30">
            <div className="flex flex-wrap items-center justify-center gap-2 px-4">
              <Button
                variant="agent"
                className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
              >
                <Sparkles className="w-5 h-5" />
                Brainstorm
              </Button>
              <PostToneSelector />
              <SocialMediaSelector />
              <PostTypeSelector />
            </div>
          </div>
          <div className="flex items-end gap-3 px-6 py-4">
            <ToolsSelector />

            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Start from an idea for your content"
                rows={1}
                className="min-h-[36px] max-h-32 resize-none border-none bg-transparent text-on-surface placeholder:text-on-surface-variant focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={!inputValue.trim()}
              >
                <SendHorizonal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
