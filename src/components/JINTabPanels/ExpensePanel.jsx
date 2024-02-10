import { TabPanel, Heading } from "@chakra-ui/react";

const ExpensePanel = () => {
  return (
    <TabPanel>
      <Heading
        as="h2"
        size="lg"
        textColor="rgb(25, 16, 91)"
        fontFamily="Arial"
        p="5px"
      >
        Expense
      </Heading>
    </TabPanel>
  );
};

export default ExpensePanel;
