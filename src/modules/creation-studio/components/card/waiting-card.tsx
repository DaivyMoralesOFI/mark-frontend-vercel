import { Card, CardContent } from "@/shared/components/ui/card";

const WaitingCard = () => {
  return (
    <Card className="bg-transparent border-0 shadow-none max-w-[300px] max-h-[250px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <CardContent className="">
        <div className="loader">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <mask id="clipping">
                <polygon
                  points="0,0 100,0 100,100 0,100"
                  fill="black"
                ></polygon>
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
      </CardContent>
    </Card>
  );
};

export default WaitingCard;
