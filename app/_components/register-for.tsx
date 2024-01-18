"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface RegisterForProps {
  workshopId: string;
  userId: string;
}

const RegisterFor: React.FC<RegisterForProps> = ({ workshopId, userId }) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      const response = await axios.post("/api/", { workshopId, userId });
      router.refresh();
      toast.success("Zarejestrowano na warsztat!");
    } catch (error) {
      console.error(error);
      toast.error(
        "Wystąpił błąd podczas rejestracji na warsztat. Spróbuj ponownie później."
      );
    }
  };

  return <Button onClick={onClick}>Zarejestruj się na warsztat</Button>;
};

export default RegisterFor;
