import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import MarkDevSite from "@/assets/logos/mark-colored.svg";

const AppHeader = () => {
  return (
    <header className="sticky top-10 left-1/2 -translate-x-1/2 max-w-3xl max-h-fit w-full m-0 p-0 z-999 ">
      <div className="w-full min-h-10 px-8 py-2 relative flex justify-between items-center shadow-xl bg-surface-container-lowest border border-primary rounded-xl backdrop-blur-lg">
        <div className="flex">
          <Avatar className="rounded-none w-8 h-8">
            <AvatarImage src={MarkDevSite} />
            <AvatarFallback>Mark</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex">
          <nav className="flex justify-between items-center gap-3 list-none ">
            <Link to="/app/dashboard">Analytics</Link>
            <Link to="/app/creation-studio/new/content">Create content</Link>
            <Link to="/app/creation-studio/brand-dna-extractor">
              Brands Extractor
            </Link>
          </nav>
        </div>
        <div className="flex">
          <nav className="flex justify-between items-center gap-3 list-none">
            <Avatar className="w-10 h-10 border border-outline rounded-full">
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0bK8rvtpBZu7L_MwWCCfPrW4TGnkT6jxJHA&s"
                className="object-cover object-center"
              ></AvatarImage>
            </Avatar>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
