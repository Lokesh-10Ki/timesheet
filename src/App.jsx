import "./index.css";
import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import {
  Box,
  Tabs,
} from "@chakra-ui/react";

import JINTabPanelsList from "./components/JINTabPanelList";
//import { useState } from "react";
import "./App.css";
import JINTabList from "./components/JINTabList";

const App = () => {



  return (
    <Box>
      {/* -------- side bar --------- */}
      <Tabs isLazy orientation="vertical" variant="unstyled">
      <JINTabList/>

        {/* -------- tab panels --------- */}        
        <JINTabPanelsList/>
      </Tabs>
    </Box>
  );
};
export default App;
