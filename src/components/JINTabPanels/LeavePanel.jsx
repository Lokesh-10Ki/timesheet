import { TabPanel, Heading } from "@chakra-ui/react";

const LeavePanel = () => {
    return (
        <TabPanel>
          <Heading
            as="h2"
            size="lg"
            textColor="rgb(25, 16, 91)"
            fontFamily="Arial"
            p="5px"
          >
            Leave
          </Heading>
        </TabPanel>
    );
};

export default LeavePanel;
