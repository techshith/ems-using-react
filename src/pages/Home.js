import React, { Fragment } from "react";
import { Card, Typography, Box } from "@mui/material";
import SideNavigation from "../components/UI/SideNavigation";
import team from "../assets/teams.jpg"

const Home = () => {
  return (
    <Fragment>

      <SideNavigation />
      <Card className="welcome-card">
        <Box p={4}>
          <Typography variant="h4" textAlign="center">
            Welcome to the Employee Portal
          </Typography>
          <Typography textAlign="center" mt={2}>
            This is your home base for managing employee information and tasks.<br /> Use the navigation on the left to get started.
          </Typography>

        </Box>

        <Box display="flex" justifyContent="center" p={2}>
          <img
            alt="people collaborating"
            src={team}
            width={400}
          />
        </Box>
      </Card>
    </Fragment>
  );
};

export default Home;