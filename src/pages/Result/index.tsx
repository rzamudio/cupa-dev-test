import "./styles.css";
import "../../App.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

function Result() {
  const navigate = useNavigate();

  const location = useLocation();
  const evaluatedResults: string[] = location.state?.data || [];
  const { activity_name } = useParams();

  const areQuestionsPerRound: boolean = evaluatedResults.some(
    (data) => !data.includes("CORRECT")
  );

  function groupAnswersByRound(data: any) {
    const result: any = {};
    let currentRound: any = null;

    for (const item of data) {
      if (!item.includes("CORRECT")) {
        currentRound = item;
        if (!result[currentRound]) {
          result[currentRound] = [];
        }
      } else if (currentRound) {
        result[currentRound].push(item);
      }
    }

    return result;
  }
  const groupedAnswers = groupAnswersByRound(evaluatedResults);
  let questionNumber = 1;

  return (
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
        <div className="home_container">
          <p className="branding">{activity_name?.toUpperCase()}</p>
          <p className="title">RESULTS</p>
          <div className="hide-scroll_view">
            {areQuestionsPerRound ? (
              <>
                {Object.entries(groupedAnswers).map(
                  ([round, answers], index) => {
                    const answersArray = answers as string[];
                    return (
                      <div key={round}>
                        <div
                          className="results_item_container_no_flex"
                          key={index}
                        >
                          <div className="results_evaluated_answer">
                            {round}
                          </div>
                        </div>
                        {answersArray.map((answer, index) => {
                          const label = `Q${questionNumber++}`;
                          return (
                            <div className="results_item_container" key={index}>
                              <div className="results_question_number">
                                {label}
                              </div>
                              <div className="results_evaluated_answer">
                                {answer}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </>
            ) : (
              <>
                {evaluatedResults.map((answer, index) => {
                  const label = `Q${questionNumber++}`;
                  return (
                    <div className="results_item_container" key={index}>
                      <div className="results_question_number">{label}</div>
                      <div className="results_evaluated_answer">{answer}</div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div className="back" onClick={() => navigate(`/`)}>
            HOME
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Result;
