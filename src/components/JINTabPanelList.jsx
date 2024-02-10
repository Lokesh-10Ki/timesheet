import {
  TabPanels,
} from "@chakra-ui/react";
import DashboardPanel from "./JINTabPanels/DashboardPanel";
import LeavePanel from "./JINTabPanels/LeavePanel";
import ExpensePanel from "./JINTabPanels/ExpensePanel";
import WorkFromHomePanel from "./JINTabPanels/WorkFromHomePanel";
import FeedbackPanel from "./JINTabPanels/FeedbackPanel";
import SurveyPanel from "./JINTabPanels/SurveyPanel";
import ServiceDeskPanel from "./JINTabPanels/ServiceDeskPanel";
import FormsPanel from "./JINTabPanels/FormsPanel";
import ResourcingPanel from "./JINTabPanels/ResourcingPanel";
import TravelPanel from "./JINTabPanels/TravelPanel"
import TimesheetPanel from "./TimesheetPanel/TimesheetPanel";
 


const JINTabPanelsList = () => {
  return (
    <TabPanels>
      <DashboardPanel />
      <TimesheetPanel/>
      <LeavePanel />
      <WorkFromHomePanel />
      <FeedbackPanel />
      <SurveyPanel />
      <ServiceDeskPanel />
      <FormsPanel />
      <TravelPanel />
      <ExpensePanel />
      <ResourcingPanel />
    </TabPanels>
  );
};

export default JINTabPanelsList;
