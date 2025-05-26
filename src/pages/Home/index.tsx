import "./styles.css";
import "../../App.css";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";
import { useGetQuizDetails } from "../../services/getQuizDetails";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

function Home() {
  const navigate = useNavigate();
  const { data: quizDetails, isLoading, error } = useGetQuizDetails();

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
          <p className="branding">CAE</p>
          <p className="title">{quizDetails?.name}</p>
          <div className="home_buttons_container">
            {quizDetails?.activities.map((name, index) => (
              <CustomButton
                onPress={() => {
                  navigate(`/question/${name.activity_name}`);
                }}
                key={index}
              >
                <div
                  style={{
                    padding: "24px 84px 23px 83px",
                    borderTop: "1px solid #c7e6fe",
                    background: "#FDFBFC",
                  }}
                >
                  {name.activity_name}
                </div>
              </CustomButton>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
