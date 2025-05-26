import { QuizDetails } from "../types";
import { getQuizDetailsMock } from "../mocks/getQuizDetailsMock";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getQuizDetails = async (): Promise<QuizDetails> => {
  // Finally add this
  const response = await axios.get(
    "https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json"
  );

  console.log("response.data!: ", response.data);
  return response.data;
};

// Reusable hook
export const useGetQuizDetails = () => {
  return useQuery({
    queryKey: ["quizDetails"],
    queryFn: getQuizDetails,
  });
};
