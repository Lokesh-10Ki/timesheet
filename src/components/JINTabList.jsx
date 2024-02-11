import { TabList, Image, Tab, Flex, Divider, Text} from "@chakra-ui/react";

const JINTabList = () => {
    return (
      <TabList
        textColor="white"
        width="15%"
        height="fit"
        minH="100vh"
        bgGradient="linear(#19105b, #612a6e, #fe6196)"
        pl="5px"
        position="relative"
      >
        <Image
          src="/page_logo.png"
          w="20px"
          h="27.2px"
          mt="10px"
          ml="17px"
          mb="20px"
        ></Image>
        <Tab
          justifyContent="left"
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
        >
          Dashboard
        </Tab>
        <Tab
          justifyContent="left"
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
        >
          Timesheet
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Leave
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Work From Home
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Feedback
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Survey
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Service Desk
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Forms
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Travel
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Expenses
        </Tab>
        <Tab
          fontSize="12px"
          fontWeight="400"
          fontFamily="Arial"
          justifyContent="left"
        >
          Resourcing
        </Tab>
        <Flex
          position="absolute"
          bottom="0"
          w="100%"
          pb="20px"
          flexDirection="column"
        >
          <Divider mb="20px" colorScheme="red" />
          <Flex justifyContent="space-evenly" alignItems="center">
            <Text fontSize="10px" fontWeight="700" fontFamily="Arial">
              Lokesh Devaraj
            </Text>
            <a href="#">
              <i className="pi pi-sign-out" style={{ fontSize: "1rem" }}></i>
            </a>
          </Flex>
        </Flex>
      </TabList>
    );
};

export default JINTabList;