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

type GroupedAnswers = {
  round_title: string;
  answers: string[];
};

function Question() {
  const navigate = useNavigate();
  const { activity_name } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [evaluatedAnswers, setEvaluatedAnswers] = useState<string[]>([]);
  const [isRoundStart, setIsRoundStart] = useState<boolean>(true);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [numberOfRounds, setNumberOfRounds] = useState<number>(0);
  const [roundQuestions, setRoundQuestion] = useState<RoundQuestion[]>();
  const [roundTitle, setRoundTitle] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const { data: quizDetails, isLoading, error } = useGetQuizDetails();

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

  console.log("pageCount: ", pageCount);

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
      console.log("roundQuestions?.length: ", roundQuestions?.length);
      if (page < 1 || page > roundQuestions?.length! - 1) {
        console.log("HAHA 1");
        setIsRoundStart(true);
        setNumberOfRounds(filteredQuestions.questions.length);
        setRoundNumber((prev) => prev + 1);
        setRoundQuestion(
          filteredQuestions.questions.find(
            (data) => data.round_title === roundTitle
          )?.questions
        );
      } else {
        console.log("HAHA 2");
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
      setNumberOfRounds(filteredQuestions.questions.length);
      setRoundTitle(
        filteredQuestions.questions.find((data) => data.order === roundNumber)
          ?.round_title
      );

      setRoundQuestion(
        filteredQuestions.questions.find(
          (data) => data.round_title === roundTitle
        )?.questions
      );
      const timer = setTimeout(() => {
        setIsRoundStart(false);
        setEvaluatedAnswers((prev: any) => [...prev, roundTitle]);
        navigate(`/question/${activity_name}`, { replace: true });
        setTriggerAnimation(true);
      }, 1000);
      setTimeout(() => {
        setTriggerAnimation(false);
      }, 1100);
      return () => clearTimeout(timer);
    }

    console.log("isRoundStart: ", isRoundStart);
    console.log("areQuestionsPerRound: ", areQuestionsPerRound);
    console.log("roundQuestions: ", roundQuestions);
    console.log("currentPage: ", currentPage);
    console.log("roundTitle: ", roundTitle);
    console.log("progress: ", progress);
    console.log("evaluatedAnswers: ", evaluatedAnswers);
    // console.log(
    //   " roundQuestions![currentPage].stimulus",
    //   roundQuestions![currentPage].stimulus
    // );
  }, [
    isRoundStart,
    roundNumber,
    roundTitle,
    currentPage,
    progress,
    triggerAnimation,
  ]);

  return (
    <AnimatePresence mode="wait">
      {!triggerAnimation && (
        <motion.div
          className="page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
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
                      <div
                        style={{
                          padding: "24px 84px 23px 83px",
                          borderTop: "1px solid #c7e6fe",
                        }}
                      >
                        {USER_ANSWER.CORRECT}
                      </div>
                    </CustomButton>
                  </div>
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
                      <div
                        style={{
                          padding: "24px 84px 0px 83px",
                          borderTop: "1px solid #c7e6fe",
                        }}
                      >
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
  );
}

export default Question;
