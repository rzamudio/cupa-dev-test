import { QuizDetails } from "../types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getQuizDetails = async (): Promise<QuizDetails> => {
  // Use proxy for demo purposes only. CORS config should be done in BE
  const response = await axios.get(
    "https://cors-anywhere.herokuapp.com/https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json"
  );

  return response.data;
};

// Reusable hook
export const useGetQuizDetails = () => {
  return useQuery({
    queryKey: ["quizDetails"],
    queryFn: getQuizDetails,
  });
};
