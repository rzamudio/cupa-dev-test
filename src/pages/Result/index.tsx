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

  const filteredAnswers = evaluatedResults.filter((item) =>
    item.includes("CORRECT")
  );

  return (
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
        <div className="home_container">
          <p className="branding">{activity_name?.toUpperCase()}</p>
          <p className="title">RESULTS</p>
          <div className="hide-scroll_view">
            {filteredAnswers?.map((data, index) => (
              <>
                {data.includes("CORRECT") ? (
                  <div className="results_item_container" key={index}>
                    <div className="results_question_number">
                      {`Q` + (index + 1)}
                    </div>
                    <div className="results_evaluated_answer">{data}</div>
                  </div>
                ) : (
                  <div className="results_item_container_no_flex" key={index}>
                    <div className="results_evaluated_answer">{data}</div>
                  </div>
                )}
              </>
            ))}
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
