/**
 *  @author: Phillip Nguyen
 *  Component: Quiz
 *  Date: 11/15/2023
 *  Objective: Building a quiz feature for students to complete quizzes on our own application
 *
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";

import {
  fetchQuestionsSuccess,
  selectAnswer,
} from "../../redux/actions/quizActions";
import Notification from "../SnackBar/SnackBar";

import "./Quiz.css";

const Quiz = ({
  type,
  questions,
  correctAnswers,
  userResponses,
  fetchQuestionsSuccess,
  selectAnswer,
}) => {
  const [newQuestions, setNewQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );
  const [questionIndex, setQuestionIndex] = useState(null);
  const [selectedOptionsMC, setSelectedOptionsMC] = useState([
    false,
    false,
    false,
    false,
  ]);

  const [userResponseMC, setUserResponseMC] = useState([]);
  const [userResponsesMC, setUserResponsesMC] = useState([]);

  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(true);

  useEffect(() => {
    // Simulate fetching questions asynchronously
    // Replace this with your actual API call
    const fetchQuestions = async () => {
      const response = await fetch("http://localhost:3001/api/questions");
      const data = await response.json();

      const filteredData = data.filter((question) => question.type === type);
      const multipleChoiceQs = filteredData.filter(
        (question) => typeof question.correctAnswer === "object"
      );

      setNewQuestions(filteredData);
      setSelectedOptions(Array(filteredData.length).fill(null));
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const currentUserResponsesMC = correctAnswers.map((response) => {
      if (Array.isArray(response)) {
        return [];
      } else {
        return null;
      }
    });

    setUserResponsesMC(currentUserResponsesMC);
  }, [correctAnswers, type]);

  useEffect(() => {
    fetchQuestionsSuccess(newQuestions);
  }, [fetchQuestionsSuccess, newQuestions]);

  useEffect(() => {
    selectAnswer(questionIndex, userResponseMC);
    const updatedSelectedOptions = [...selectedOptions];

    // Update the specific index with the new userResponseMC
    updatedSelectedOptions[questionIndex] = userResponseMC;

    // Update the state with the modified selectedOptions array
    setSelectedOptions(updatedSelectedOptions);
  }, [selectAnswer, userResponseMC]);

  if (!questions) {
    return <>Loading...</>;
  }

  // console.log(selectedOptions);

  const handleOptionClick = (questionIndex, optionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = optionIndex;
    if (typeof questions[questionIndex].correctAnswers !== "object") {
      setSelectedOptions(updatedSelectedOptions);
      selectAnswer(questionIndex, optionIndex); // Dispatch the selected answer to Redux
    }
  };

  const handleCheckboxChange = async (event, question, index, optionIndex) => {
    const { checked } = event.target;
    const updatedSelectedOptionsMC = [...selectedOptionsMC];
    const updatedSelectedOptions = [...selectedOptions];

    const currentSelectedOptionsMC = []; // have []
    console.log("updatedSelectedOptions[index]", index);
    console.log(updatedSelectedOptions);
    // if (currentSelectedOptionsMC.includes(optionIndex)) {
    //   currentSelectedOptionsMC.filter((option) => option !== optionIndex);
    // } else {
    //   currentSelectedOptionsMC.push(optionIndex);
    // }
    // console.log("currentSelectedOptionsMC");
    // console.log(currentSelectedOptionsMC);

    updatedSelectedOptionsMC[optionIndex] = checked;

    const currentUserResponsesMC = [...userResponsesMC];

    console.log(checked, optionIndex);
    if (checked) {
      currentUserResponsesMC[index].push(optionIndex);
      console.log("choice selected " + optionIndex);
    } else {
      currentUserResponsesMC[index] = currentUserResponsesMC[index].filter(
        (option) => option !== optionIndex
      );
      console.log("choice deselected " + optionIndex);
    }

    console.log("+++ currentUserResponsesMC +++");
    console.log(currentUserResponsesMC);

    updatedSelectedOptions[index] = currentUserResponsesMC[index];

    // console.log(userResponseMC);
    // setUserResponsesMC(currentUserResponsesMC);
    setUserResponsesMC(currentUserResponsesMC);
    setSelectedOptions(updatedSelectedOptions);
    setQuestionIndex(index);
    setSelectedOptionsMC(updatedSelectedOptionsMC);
    selectAnswer(index, userResponseMC);
  };

  // console.log(userResponses);
  console.log("----userResponsesMC----");
  console.log(userResponsesMC);
  // console.log(userResponseMC);
  console.log("----- Selected Options -----");
  console.log(selectedOptions);
  // console.log(selectedOptionsMC);
  // console.log("----- CorrectAnswers -----");
  // console.log(correctAnswers);

  console.log("quiz type: " + type);
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };

  const handleBackgroundColor = (index, optionIndex) => {
    if (submitted) {
      // console.log("Correct-Answer with BgColor");
      // console.log(correctAnswers);
      // console.log("User responses with BgColor");
      // console.log(userResponses);
      if (typeof selectedOptions[index] !== "object") {
        return selectedOptions[index] === optionIndex
          ? correctAnswers[index] === userResponses[index]
            ? "#00e348"
            : "#ff4141"
          : correctAnswers[index] === optionIndex
          ? "#00e348"
          : "#dddddd";
      } else {
        // console.log("correct answer" + index);
        // console.log(correctAnswers[index]);

        return correctAnswers[index] &&
          correctAnswers[index].includes(optionIndex)
          ? "#00e348"
          : "#ff4141";
      }
    }
    return selectedOptions[index] === optionIndex ? "#419aff" : "#ffffff";
  };

  const handleSubmit = () => {
    let newScore = score; // Initialize a variable to keep track of the new score

    // Compare userResponses with correctAnswers
    selectedOptions.forEach((response, index) => {
      if (typeof response !== "object") {
        if (response === correctAnswers[index]) {
          newScore++; // Increment the score when the response is correct
        }
      } else {
        if (response.length === correctAnswers[index].length) {
          console.log("== MC Submit ==");
          const sortedArr1 = response.slice().sort();
          const sortedArr2 = correctAnswers[index].slice().sort();
          console.log("------Submission------");
          console.log("response");
          console.log(sortedArr1);
          console.log("correctAnswers");
          console.log(sortedArr2);
          if (sortedArr1.every((value, index) => value === sortedArr2[index])) {
            newScore++;
          }
        }
      }
    });

    setScore(newScore); // Update the score state with the new score
    setSubmitted(true); // Set submitted to true to indicate the quiz has been submitted
  };

  return (
    <Box
      className="quiz-container"
      sx={{
        margin: "20px",
        padding: "30px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)", // Box shadow
      }}
    >
      {questions.length > 0 &&
        questions.map((question, index) => (
          <Box
            key={index}
            className="question-card"
            sx={{ marginBottom: "20px" }}
          >
            {question.type === type && (
              <>
                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                  {question.question}
                </Typography>
                {question.imgURL && (
                  <img
                    class="img-url"
                    src={question.imgURL}
                    alt={question.question}
                  />
                )}
                <List>
                  <>
                    {!Array.isArray(question.correctAnswer)
                      ? question.options?.map((option, optionIndex) => (
                          <ListItem key={optionIndex} disablePadding>
                            <ListItemButton
                              onClick={() =>
                                handleOptionClick(index, optionIndex)
                              }
                              sx={{
                                backgroundColor: handleBackgroundColor(
                                  index,
                                  optionIndex
                                ),
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "8px",
                                border: "1px solid #000000",
                                "&:hover": {
                                  backgroundColor: "#bfdfff", // Light red background on hover
                                },
                              }}
                            >
                              {option}
                            </ListItemButton>
                          </ListItem>
                        ))
                      : question.options?.map((option, optionIndex) => (
                          <ListItem key={optionIndex} disablePadding>
                            <FormControlLabel
                              sx={{
                                backgroundColor: handleBackgroundColor(
                                  index,
                                  optionIndex
                                ),
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "8px",
                                border: "1px solid #000000",
                                width: "100%",
                              }}
                              control={
                                <Checkbox
                                  onChange={(event) =>
                                    handleCheckboxChange(
                                      event,
                                      question,
                                      index,
                                      optionIndex
                                    )
                                  }
                                />
                              }
                              label={option}
                            />
                          </ListItem>
                        ))}
                  </>
                </List>
              </>
            )}
          </Box>
        ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitted} // Disable button after submission
        sx={{ marginTop: "20px" }}
      >
        Submit Quiz
      </Button>
      {submitted && (
        <>
          <Typography variant="h6" sx={{ marginTop: "20px" }}>
            Your Score: {score} out of {questions.length}
          </Typography>
          <Notification
            open={notificationOpen}
            handleClose={handleNotificationClose}
            message={`You submitted successfully, your score is: ${(
              (score * 100) /
              questions.length
            ).toFixed(2)}%`}
            severity={"success"}
          />
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  questions: state.quiz.questions,
  userResponses: state.quiz.userResponses,
  correctAnswers: state.quiz.correctAnswers,
});
export default connect(mapStateToProps, {
  fetchQuestionsSuccess,
  selectAnswer,
})(Quiz);
