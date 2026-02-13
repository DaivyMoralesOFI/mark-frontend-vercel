import { Card } from "@/shared/components/ui/card";

const WaitingCard = () => {
  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="loader mx-auto w-[100px]">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <mask id="clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
              <polygon points="25,25 75,25 50,75" fill="white"></polygon>
              <polygon points="50,25 75,75 25,75" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
            </mask>
          </defs>
        </svg>
        <div className="box"></div>
      </div>
      <Card className="p-4 gap-1">
        <h2 className="text-center text-lg font-bold">Hi, again!</h2>
        <p className="text-center text-sm">What do you have in mind?</p>
      </Card>
    </div>
  );
};

export default WaitingCard;
