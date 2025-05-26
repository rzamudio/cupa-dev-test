import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Question from "./pages/Question";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Result from "./pages/Result";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question/:activity_name" element={<Question />} />
            <Route path="/result/:activity_name" element={<Result />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
