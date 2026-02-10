import { useState, useEffect } from "react";
import BottomNavbar from "@/modules/creation-studio/components/navbar/bottom-navbar";
import WaitingCard from "@/modules/creation-studio/components/card/waiting-card";
import { StartingAlert } from "@/modules/creation-studio/components/alerts/starting-alert";

const CreateNewContentPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    // Lanzar el alerta al entrar a la página
    setIsAlertOpen(true);
  }, []);

  return (
    <div className="w-full h-full">
      <StartingAlert open={isAlertOpen} onOpenChange={setIsAlertOpen} />
      <WaitingCard />
      <BottomNavbar />
    </div>
  );
};

export default CreateNewContentPage;
