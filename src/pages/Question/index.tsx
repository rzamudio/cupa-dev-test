import "./styles.css";
import "../../App.css";
import CustomButton from "../../components/CustomButton";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetQuizDetails } from "../../services/getQuizDetails";
import { Activity, RoundQuestion } from "../../types";
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

enum USER_ANSWER {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
}

function Question() {
  const navigate = useNavigate();
  const { activity_name } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [evaluatedAnswers, setEvaluatedAnswers] = useState<string[]>([]);
  const [isRoundStart, setIsRoundStart] = useState<boolean>(true);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [roundQuestions, setRoundQuestion] = useState<RoundQuestion[]>();
  const [roundTitle, setRoundTitle] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const { data: quizDetails } = useGetQuizDetails();

  const filteredQuestions: Activity = quizDetails?.activities?.find((data) =>
    data.activity_name.toLowerCase().includes(activity_name?.toLowerCase()!)
  )!;

  // Check if questions are per round
  const areQuestionsPerRound: boolean = filteredQuestions.questions.some(
    (obj) => "round_title" in obj
  );

  // Round related
  // Count how many pages
  // Exclude round title pages
  let pageCount = 0;
  if (areQuestionsPerRound) {
    pageCount =
      filteredQuestions.questions.find(
        (data) => data.round_title === roundTitle
      )?.questions?.length! +
      filteredQuestions.questions.reduce(
        (acc, round) => acc + round.questions!.length,
        0
      ) -
      3;
  }

  // function to evaluate if the user answered correctly
  function evaluateUserAnswers(
    prevAnswers: string[],
    answer: string,
    is_correct: boolean
  ): string[] {
    if (answer === USER_ANSWER.CORRECT && is_correct === true)
      return [...prevAnswers, USER_ANSWER.CORRECT];
    else if (answer === USER_ANSWER.INCORRECT && is_correct === true)
      return [...prevAnswers, USER_ANSWER.INCORRECT];
    else if (answer === USER_ANSWER.CORRECT && is_correct === false)
      return [...prevAnswers, USER_ANSWER.INCORRECT];
    else return [...prevAnswers, USER_ANSWER.CORRECT];
  }

  // Button action when user answers a question
  const goToPage = (page: number, answer: string, is_correct: boolean) => {
    setTriggerAnimation(true);
    setTimeout(() => {
      setTriggerAnimation(false);
    }, 500);
    if (areQuestionsPerRound) {
      const updatedAnswers = evaluateUserAnswers(
        evaluatedAnswers,
        answer,
        is_correct
      );
      setEvaluatedAnswers(updatedAnswers);
      setProgress((prev) => prev + 1);
      if (progress === pageCount) {
        navigate(`/result/${activity_name}`, {
          state: { data: updatedAnswers },
        });
        return;
      }
      if (page < 1 || page > roundQuestions?.length! - 1) {
        setIsRoundStart(true);
        setRoundNumber((prev) => prev + 1);
        setRoundQuestion(
          filteredQuestions.questions.find(
            (data) => data.round_title === roundTitle
          )?.questions
        );
      } else {
        setCurrentPage(page);
      }
    } else {
      const updatedAnswers = evaluateUserAnswers(
        evaluatedAnswers,
        answer,
        is_correct
      );
      setEvaluatedAnswers(updatedAnswers);
      if (page < 1 || page > filteredQuestions?.questions.length - 1) {
        navigate(`/result/${activity_name}`, {
          state: { data: updatedAnswers },
        });
      } else {
        setCurrentPage(page);
      }
    }
  };

  useEffect(() => {
    if (areQuestionsPerRound && isRoundStart) {
      setCurrentPage(0);
      setIsRoundStart(true);
      setRoundTitle(
        filteredQuestions.questions.find((data) => data.order === roundNumber)
          ?.round_title
      );

      setRoundQuestion(
        filteredQuestions.questions.find(
          (data) => data.round_title === roundTitle
        )?.questions
      );

      // Add delay when displaying round title screen
      // Add animation
      const timer = setTimeout(() => {
        setIsRoundStart(false);
        setEvaluatedAnswers((prev: any) => [...prev, roundTitle]);
        navigate(`/question/${activity_name}`, { replace: true });
        setTriggerAnimation(true);
      }, 1000);
      setTimeout(() => {
        setTriggerAnimation(false);
      }, 1100);

      // cleanup function
      return () => {
        clearTimeout(timer);
      };
    }
  }, [
    isRoundStart,
    roundNumber,
    roundTitle,
    currentPage,
    progress,
    triggerAnimation,
  ]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100vh",
      }}
    >
      <AnimatePresence mode="wait">
        {!triggerAnimation && (
          <motion.div
            className="page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <div className="App">
              <div className="activity_container">
                <div className="header_container">
                  <p className="activity_counter">
                    {activity_name?.toUpperCase()}
                    {!isRoundStart &&
                      areQuestionsPerRound &&
                      " / " + roundTitle?.toUpperCase()}
                  </p>
                  <p className="question_counter">
                    {isRoundStart && areQuestionsPerRound
                      ? roundTitle?.toUpperCase()
                      : `Q` +
                        filteredQuestions?.questions[currentPage].order +
                        "."}
                  </p>
                </div>
                {areQuestionsPerRound && !isRoundStart ? (
                  <div
                    className="question_container"
                    dangerouslySetInnerHTML={{
                      __html: roundQuestions![currentPage].stimulus.replace(
                        /\*(.*?)\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  ></div>
                ) : areQuestionsPerRound && isRoundStart ? (
                  <></>
                ) : (
                  <div
                    className="question_container"
                    dangerouslySetInnerHTML={{
                      __html: filteredQuestions.questions[
                        currentPage
                      ].stimulus?.replace(/\*(.*?)\*/g, "<strong>$1</strong>")!,
                    }}
                  ></div>
                )}

                {isRoundStart && areQuestionsPerRound ? (
                  <div className="empty_container"></div>
                ) : (
                  <div className="question_buttons_container">
                    <div className="button_item">
                      <CustomButton
                        onPress={() => {
                          if (areQuestionsPerRound) {
                            goToPage(
                              currentPage + 1,
                              USER_ANSWER.CORRECT,
                              roundQuestions?.[currentPage].is_correct!
                            );
                          } else {
                            goToPage(
                              currentPage + 1,
                              USER_ANSWER.CORRECT,
                              filteredQuestions?.questions[currentPage]
                                .is_correct!
                            );
                          }
                        }}
                      >
                        <div className="button_container">
                          {USER_ANSWER.CORRECT}
                        </div>
                      </CustomButton>
                    </div>
                    <div className="button_item">
                      <CustomButton
                        className="button_style"
                        onPress={() => {
                          if (areQuestionsPerRound) {
                            goToPage(
                              currentPage + 1,
                              USER_ANSWER.INCORRECT,
                              roundQuestions?.[currentPage].is_correct!
                            );
                          } else {
                            goToPage(
                              currentPage + 1,
                              USER_ANSWER.INCORRECT,
                              filteredQuestions?.questions[currentPage]
                                .is_correct!
                            );
                          }
                        }}
                      >
                        <div className="button_container">
                          {USER_ANSWER.INCORRECT}
                        </div>
                      </CustomButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Question;
