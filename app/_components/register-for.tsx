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
      toast.success("Signed up for workshop!");
    } catch (error) {
      console.error(error);
      toast.error(
        "You are already signed up for workshop or your role is not the user!"
      );
    }
  };

  return <Button onClick={onClick}>Sign up for workshop!</Button>;
};

export default RegisterFor;
