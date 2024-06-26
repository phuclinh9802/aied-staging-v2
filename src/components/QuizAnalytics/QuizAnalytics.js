import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";

const QuizAnalytics = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/questions`)
      .then((response) => {
        setQuestions(response.data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const filteredQuestions =
    selectedTypes.length === 0
      ? questions
      : questions.filter((question) => selectedTypes.includes(question.type));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Filter by Type</Typography>
        <FormGroup
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
        >
          {Array.from(new Set(questions.map((question) => question.type))).map(
            (type, index) => (
              <FormControlLabel
                control={
                  <Checkbox
                    key={index}
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    label={type}
                  />
                }
                label={
                  type.includes("python")
                    ? type.replace("python", "python-lesson-")
                    : type
                }
              />
            )
          )}
        </FormGroup>
      </Grid>
      {loading ? (
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Grid>
      ) : (
        filteredQuestions.map((question, index) => (
          <Grid
            item
            xs={36}
            sm={18}
            md={6}
            key={index}
            sx={{ padding: "10px" }}
          >
            <Paper elevation={3} sx={{ padding: "20px", height: "100%" }}>
              <Typography sx={{ fontWeight: "bold" }} variant="h5">
                <div
                  dangerouslySetInnerHTML={{
                    __html: question.question,
                  }}
                  style={{
                    padding: "0 20px",
                    textAlign: "left",
                    overflow: "scroll",
                  }}
                />
              </Typography>
              <List
                sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
              >
                {question.options.map((option, optionIndex) => (
                  <ListItem
                    key={optionIndex}
                    sx={{
                      marginRight: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ textDecoration: "underline" }}>
                      Option {optionIndex}:
                    </span>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: option,
                      }}
                      style={{ padding: "0 20px" }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography variant="body1">
                  <InfoIcon /> Correct Answer:{" "}
                  {JSON.stringify(question.correctAnswer)}
                </Typography>
                <Typography sx={{ color: "green" }} variant="body1">
                  <CheckIcon /># of Right Answers: {question.rightAnswer ?? 0}
                </Typography>
                <Typography sx={{ color: "red" }} variant="body1">
                  <DangerousIcon /> # of Wrong Answers:{" "}
                  {question.wrongAnswer ?? 0}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default QuizAnalytics;
