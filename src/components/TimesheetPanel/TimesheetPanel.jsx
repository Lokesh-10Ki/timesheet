import AllocatioExtensionAccordion from "./AllocatioExtensionAccordion";

import {
  Box,
  Flex,
  Button,
  TabPanel,
  Heading,
  IconButton,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  InputRightElement,
  MenuItem,
  InputGroup,
} from "@chakra-ui/react";

import {
  AddIcon,
  ArrowForwardIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";

import {
  BAUProjects,
  salesProjects,
  BAU1Tasks,
  BAU2Tasks,
  accMgmtTasks,
  leadGenerationTasks,
  otherTasks,
  opportunityTasks,
} from "./DropdownOptions";

const TimesheetPanel = () => {
  const BAURowTemplate = {
    startDate: weekStartDate,
    projectType: "BAU Activity",
    projectName: "",
    task: "",
    comment: "",
    hours: {
      mon: "",
      tue: "",
      wed: "",
      thu: "",
      fri: "",
      sat: "",
      sun: "",
    },
    total: "",
  };

  const salesRowTemplate = {
    startDate: weekStartDate,
    projectType: "Sales Activity",
    projectName: "",
    task: "",
    comment: "",
    hours: {
      mon: "",
      tue: "",
      wed: "",
      thu: "",
      fri: "",
      sat: "",
      sun: "",
    },
    total: "",
  };

  //States declaration
  const [weekStartDate, setWeekStartDate] = useState(DateTime.local());
  const [weekEndDate, setWeekEndDate] = useState(DateTime.local());
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState(otherTasks);
  const [BAURows, setBAURows] = useState([BAURowTemplate]);
  const [salesRows, setSalesRows] = useState([salesRowTemplate]);
  const [total, setTotal] = useState({
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
    overall: 0,
  });

  //Effect to set the current week on component mount
  useEffect(() => {
    setCurrentWeek();
  }, []);

  //Effect to clear search bar after dropdown toggle
  useEffect(() => {
    setSearchTerm("");
  }, [isOpen]);

  //Functon to handle task dropdown wrt project name
  const handleTaskChange = (projectName) => {
    if (projectName === "BAU_001 Training & Project Knowledge") {
      setTasks(BAU1Tasks);
    } else if (projectName === "BAU_002 People") {
      setTasks(BAU2Tasks);
    } else if (projectName === "Account Management") {
      setTasks(accMgmtTasks);
    } else if (projectName === "Lead Generation") {
      setTasks(leadGenerationTasks);
    } else if (projectName === "Opportunity") {
      setTasks(opportunityTasks);
    } else {
      setTasks(otherTasks);
    }
  };

  //Search bar filters
  const filteredBAUProjects = BAUProjects.filter((project) =>
    project.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSalesProjects = salesProjects.filter((project) =>
    project.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTasks = tasks.filter((task) =>
    task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Function to calculate and set the start and end dates of the current week
  const setCurrentWeek = () => {
    console.log(weekStartDate);
    const today = DateTime.now();
    const weekStart = today.startOf("week");
    const weekEnd = today.endOf("week");
    setWeekStartDate(weekStart);
    setWeekEndDate(weekEnd);
  };

  //Function to navigate to the previous week
  const handlePrevWeek = () => {
    const prevWeekStart = weekStartDate.minus({ weeks: 1 });
    const prevWeekEnd = prevWeekStart.endOf("week");
    setWeekStartDate(prevWeekStart);
    setWeekEndDate(prevWeekEnd);
  };

  //Function to navigate to the next week
  const handleNextWeek = () => {
    const nextWeekStart = weekStartDate.plus({ weeks: 1 });
    const nextWeekEnd = nextWeekStart.endOf("week");
    setWeekStartDate(nextWeekStart);
    setWeekEndDate(nextWeekEnd);
  };

  //Functions to add and delete rows in timesheet table

  const addBAURow = () => {
    setBAURows((prevRows) => [...prevRows, , { ...BAURowTemplate }]);
  };

  const addSalesRow = () => {
    setSalesRows((prevRows) => [...prevRows, , { ...salesRowTemplate }]);
  };

  const deleteBAURow = (indexToDelete) => {
    setBAURows((prevRows) =>
      prevRows.filter((_, index) => index !== indexToDelete)
    );
  };

  const deleteSalesRow = (indexToDelete) => {
    setSalesRows((prevRows) =>
      prevRows.filter((_, index) => index !== indexToDelete)
    );
  };

  //Function to manage project and task state => Project Name, Task, Comment
  const handleInputChange = (type, rowIndex, field, value) => {
    setIsOpen(!isOpen);
    setSearchTerm("");
    if (type == "BAU Activity") {
      setBAURows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex][field] = value;
        return updatedRows;
      });
      console.log(BAURows);
    } else {
      if (type == "Sales Activity") {
        setSalesRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[rowIndex][field] = value;
          return updatedRows;
        });
        console.log(salesRows);
      }
    }
  };

  //Function to manage hour state => No. of hours worked
  const handleHourChange = (type, rowIndex, day, value) => {
    if (type === "BAU Activity") {
      setBAURows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex].hours[day] = value;
        updatedRows[rowIndex].total = calculateRowTotal(
          updatedRows[rowIndex].hours
        );
        updateTotals([...updatedRows, ...salesRows]);
        return updatedRows;
      });
    } else if (type === "Sales Activity") {
      setSalesRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex].hours[day] = value;
        updatedRows[rowIndex].total = calculateRowTotal(
          updatedRows[rowIndex].hours
        );
        updateTotals([...BAURows, ...updatedRows]);
        return updatedRows;
      });
    }
  };

  //Calculate total for individual rows
  const calculateRowTotal = (hours) => {
    let rowTotal = 0;
    for (const day in hours) {
      rowTotal += parseInt(hours[day]) || 0; //Ensure value is a number
    }
    return rowTotal;
  };

  //Calculate day-wise and overall totals => total state
  const updateTotals = (rows) => {
    const dayWiseTotals = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };

    let overallTotal = 0;

    rows.forEach((row) => {
      for (const day in row.hours) {
        const hours = parseInt(row.hours[day]) || 0; //Ensure value is a number
        dayWiseTotals[day] += hours;
        overallTotal += hours;
      }
    });

    // Update the total state
    setTotal({
      ...dayWiseTotals,
      overall: overallTotal,
    });
  };

  //Save button handler
  const saveData = () => {
    //Combine timesheet row data
    const dataToSave = {
      weekStartDate: weekStartDate,
      BAURows: BAURows,
      salesRows: salesRows,
      total: total,
    };

    //Convert the combined data object to a JSON string
    const jsonData = JSON.stringify(dataToSave);

    //Save the JSON in local storage
    localStorage.setItem("timesheetData", jsonData);
  };

  return (
    <TabPanel>
      <Box pt="5px">
        <Heading
          as="h2"
          size="lg"
          textColor="#19105b"
          fontFamily="Arial"
          mb="10px"
        >
          Timesheet
        </Heading>

        {/* -------- Flex display for total hours and week switch -------- */}
        <Flex justifyContent="space-between" alignContent="center" p="2px">
          <Text
            sx={{
              fontSize: "13px",
              fontFamily: "Arial",
              fontWeight: 700,
            }}
            mt="10px"
          >
            Total Hours: {total.overall}
          </Text>
          <Text
            sx={{
              fontSize: "13px",
              fontFamily: "Arial",
              fontWeight: 700,
            }}
            mb="10px"
            color="#6D6D6D"
          >
            <IconButton
              variant="unstyled"
              fontSize="25px"
              icon={<ChevronLeftIcon color="gray.500 " />}
              onClick={handlePrevWeek}
              mb="5px"
            ></IconButton>
            {weekStartDate && weekStartDate.toFormat("dd LLL yyyy")} -{" "}
            {weekEndDate && weekEndDate.toFormat("dd LLL yyyy")}
            <IconButton
              variant="unstyled"
              fontSize="25px"
              mb="5px"
              icon={<ChevronRightIcon color="gray.500 " />}
              onClick={handleNextWeek}
            ></IconButton>
          </Text>
        </Flex>

        {/* -------- Timesheet Accordion --------- */}
        <AllocatioExtensionAccordion />

        {/* -------- Timesheet Table starts -------- */}
        <Box
          bgColor="#19105b"
          color="white"
          fontSize="13px"
          fontFamily="Arial"
          fontWeight="400"
          height="35px"
          p="2"
        >
          Timesheet
        </Box>
        <Box
          w="100%"
          mb="20px"
          sx={{
            fontWeight: 700,
            textAlign: "left",
            fontSize: "13px",
            fontFamily: "Arial",
          }}
        >
          {/* ################################################################################################################################ */}

          <table className="table-auto w-full">
            {/* -------- Table header starts -------- */}
            <thead>
              <tr className="bg-[#ffe5ee] h-9 p-2 text-[#19105b]">
                <td className="p-2">Project Type</td>
                <td className="p-2">Project Name</td>
                <td className="p-2">Task</td>
                <td className="p-2">Comment</td>
                <td className="p-2">
                  Mon{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 0 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">
                  Tue{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 1 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">
                  Wed{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 2 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">
                  Thu{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 3 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">
                  Fri{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 4 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">
                  Sat{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 5 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">
                  Sun{" "}
                  <span className="font-light">
                    {weekStartDate.plus({ days: 6 }).toFormat("dd")}
                  </span>
                </td>
                <td className="p-2">Total</td>
                <td className="p-2"> </td>
                <td className="p-2 w-11"> </td>
              </tr>
            </thead>
            {/* -------- Table header ends -------- */}

            {/* ################################################################################################################################ */}

            <tbody>
              {/* -------- BAU Activity rows start -------- */}
              {BAURows.map((row, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={BAURows.length}
                      className="text-[#6a6c74] font-bold p-2"
                    >
                      BAU Activity
                    </td>
                  )}
                  <td>
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        fontSize="13px"
                        color="gray.500"
                        bgColor="#f7f9fb"
                        border="none"
                        borderRadius="2px"
                        borderColor="transparent"
                        fontWeight="light"
                        _expanded={{
                          bgColor: "#f7f9fb",
                          borderColor: "black",
                          border: "1px",
                        }}
                        w="140px"
                        p="7px"
                        rightIcon={<ChevronDownIcon boxSize="20px" />}
                      >
                        <Box
                          w="100%"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {row.projectName ? row.projectName : "Project"}
                        </Box>
                      </MenuButton>
                      <MenuList
                        maxH="200px"
                        overflowY="auto"
                        overflowX="inherit"
                        css={{
                          "&::-webkit-scrollbar": {
                            width: "7px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            borderRadius: "10px",
                            backgroundColor: "#bc4a83",
                          },
                          "&::-webkit-scrollbar-track": {
                            border: "0.8px solid rgb(219, 226, 237)",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <InputGroup>
                          <Input
                            placeholder="Search"
                            value={searchTerm}
                            textAlign="left"
                            fontSize="13px"
                            color="gray.500"
                            fontWeight="light"
                            variant="filled"
                            borderRadius="0"
                            _focus={{
                              bgColor: "#f7f9fb",
                              borderColor: "black",
                              border: "1px",
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            maxW="calc(100% - 10px)"
                            border="1px solid gray"
                            ml="7px"
                            mb="7px"
                            mr="7px"
                          />

                          <InputRightElement>
                            <SearchIcon color="gray.400" />
                          </InputRightElement>
                        </InputGroup>

                        {filteredBAUProjects.map((project, projectIndex) => (
                          <MenuItem
                            key={projectIndex}
                            fontSize="13px"
                            color="gray.500"
                            p="10px"
                            fontWeight="light"
                            borderBottom="0.8px solid rgb(219, 226, 237)"
                            onClick={() =>
                              handleInputChange(
                                "BAU Activity",
                                index,
                                "projectName",
                                project
                              )
                            }
                          >
                            {project}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </td>
                  <td>
                    {" "}
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        onClick={() => {
                          setIsOpen(!isOpen);
                          handleTaskChange(row.projectName);
                        }}
                        fontSize="13px"
                        color="gray.500"
                        bgColor="#f7f9fb"
                        border="none"
                        borderRadius="2px"
                        borderColor="transparent"
                        fontWeight="light"
                        _expanded={{
                          bgColor: "#f7f9fb",
                          borderColor: "black",
                          border: "1px",
                        }}
                        w="140px"
                        p="7px"
                        rightIcon={<ChevronDownIcon boxSize="20px" />}
                      >
                        <Box
                          w="100%"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {row.task ? row.task : "Task"}
                        </Box>
                      </MenuButton>
                      <MenuList
                        maxH="200px"
                        overflowY="auto"
                        overflowX="inherit"
                        css={{
                          "&::-webkit-scrollbar": {
                            width: "7px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            borderRadius: "10px",
                            backgroundColor: "#bc4a83",
                          },
                          "&::-webkit-scrollbar-track": {
                            border: "0.8px solid rgb(219, 226, 237)",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <InputGroup>
                          <Input
                            placeholder="Search"
                            value={searchTerm}
                            fontSize="13px"
                            color="gray.500"
                            fontWeight="light"
                            variant="filled"
                            borderRadius="0"
                            _focus={{
                              bgColor: "#f7f9fb",
                              borderColor: "black",
                              border: "1px",
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            maxW="calc(100% - 10px)"
                            border="1px solid gray"
                            ml="7px"
                            mb="7px"
                            mr="7px"
                          />

                          <InputRightElement>
                            <SearchIcon color="gray.400" />
                          </InputRightElement>
                        </InputGroup>

                        {filteredTasks.map((task, taskIndex) => (
                          <MenuItem
                            key={taskIndex}
                            fontSize="13px"
                            color="gray.500"
                            p="10px"
                            fontWeight="light"
                            borderBottom="0.8px solid rgb(219, 226, 237)"
                            onClick={() =>
                              handleInputChange(
                                "BAU Activity",
                                index,
                                "task",
                                task
                              )
                            }
                          >
                            {task}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      value={row.comment}
                      onChange={(e) =>
                        handleInputChange(
                          "BAU Activity",
                          index,
                          "comment",
                          e.target.value
                        )
                      }
                      w="140px"
                      p="7px"
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      type="number"
                      textAlign="center"
                      w="70px"
                      p="7px"
                      mt="9px"
                      mb="9px"
                      value={row.hours.mon}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "mon",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      type="number"
                      textAlign="center"
                      p="7px"
                      value={row.hours.tue}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "tue",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      type="number"
                      textAlign="center"
                      p="7px"
                      value={row.hours.wed}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "wed",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      type="number"
                      textAlign="center"
                      p="7px"
                      value={row.hours.thu}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "thu",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      type="number"
                      textAlign="center"
                      w="70px"
                      p="7px"
                      value={row.hours.fri}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "fri",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      type="number"
                      textAlign="center"
                      p="7px"
                      value={row.hours.sat}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "sat",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      type="number"
                      textAlign="center"
                      p="7px"
                      value={row.hours.sun}
                      onChange={(e) =>
                        handleHourChange(
                          "BAU Activity",
                          index,
                          "sun",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      value={row.total}
                      type="number"
                      textAlign="center"
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#fcfdfd"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <IconButton
                      variant="unstyled"
                      fontSize="15px"
                      icon={<AddIcon color="gray.500 " />}
                      onClick={addBAURow}
                    ></IconButton>
                  </td>
                  <td>
                    {index == 0 ? (
                      <></>
                    ) : (
                      <IconButton
                        variant="unstyled"
                        fontSize="15px"
                        icon={<MinusIcon color="gray.500 " />}
                        onClick={() => deleteBAURow(index)}
                      ></IconButton>
                    )}
                  </td>
                </tr>
              ))}
              {/* -------- BAU Activity rows end -------- */}

              {/* ############################################################################################################################### */}

              {/* -------- Sales Activity rows start -------- */}
              {salesRows.map((row, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={salesRows.length}
                      className="text-[#6a6c74] font-bold p-2"
                    >
                      Sales Activity
                    </td>
                  )}

                  <td>
                    <Menu m="4px">
                      <MenuButton
                        as={Button}
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        fontSize="13px"
                        color="gray.500"
                        bgColor="#f7f9fb"
                        border="none"
                        borderRadius="2px"
                        borderColor="transparent"
                        fontWeight="light"
                        _expanded={{
                          bgColor: "#f7f9fb",
                          borderColor: "black",
                          border: "1px",
                        }}
                        w="140px"
                        p="7px"
                        rightIcon={<ChevronDownIcon boxSize="20px" />}
                      >
                        <Box
                          w="100%"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {row.projectName ? row.projectName : "Project"}
                        </Box>
                      </MenuButton>
                      <MenuList
                        maxH="200px"
                        overflowY="auto"
                        overflowX="inherit"
                        css={{
                          "&::-webkit-scrollbar": {
                            width: "7px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            borderRadius: "10px",
                            backgroundColor: "#bc4a83",
                          },
                          "&::-webkit-scrollbar-track": {
                            border: "0.8px solid rgb(219, 226, 237)",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <InputGroup>
                          <Input
                            placeholder="Search"
                            value={searchTerm}
                            fontSize="13px"
                            color="gray.500"
                            fontWeight="light"
                            variant="filled"
                            borderRadius="0"
                            _focus={{
                              bgColor: "#f7f9fb",
                              borderColor: "black",
                              border: "1px",
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            maxW="calc(100% - 10px)"
                            border="1px solid gray"
                            ml="7px"
                            mb="7px"
                            mr="7px"
                          />

                          <InputRightElement>
                            <SearchIcon color="gray.400" />
                          </InputRightElement>
                        </InputGroup>

                        {filteredSalesProjects.map((project, projectIndex) => (
                          <MenuItem
                            key={projectIndex}
                            fontSize="13px"
                            color="gray.500"
                            p="10px"
                            fontWeight="light"
                            borderBottom="0.8px solid rgb(219, 226, 237)"
                            onClick={() =>
                              handleInputChange(
                                "Sales Activity",
                                index,
                                "projectName",
                                project
                              )
                            }
                          >
                            {project}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </td>
                  <td>
                    {" "}
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        onClick={() => {
                          setIsOpen(!isOpen);
                          handleTaskChange(row.projectName);
                        }}
                        fontSize="13px"
                        color="gray.500"
                        bgColor="#f7f9fb"
                        border="none"
                        borderRadius="2px"
                        borderColor="transparent"
                        fontWeight="light"
                        _expanded={{
                          bgColor: "#f7f9fb",
                          borderColor: "black",
                          border: "1px",
                        }}
                        w="140px"
                        p="7px"
                        rightIcon={<ChevronDownIcon boxSize="20px" />}
                      >
                        <Box
                          w="100%"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {row.task ? row.task : "Task"}
                        </Box>
                      </MenuButton>
                      <MenuList
                        maxH="200px"
                        overflowY="auto"
                        overflowX="inherit"
                        css={{
                          "&::-webkit-scrollbar": {
                            width: "7px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            borderRadius: "10px",
                            backgroundColor: "#bc4a83",
                          },
                          "&::-webkit-scrollbar-track": {
                            border: "0.8px solid rgb(219, 226, 237)",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <InputGroup>
                          <Input
                            placeholder="Search"
                            value={searchTerm}
                            fontSize="13px"
                            color="gray.500"
                            fontWeight="light"
                            variant="filled"
                            borderRadius="0"
                            _focus={{
                              bgColor: "#f7f9fb",
                              borderColor: "black",
                              border: "1px",
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            maxW="calc(100% - 10px)"
                            border="1px solid gray"
                            ml="7px"
                            mb="7px"
                            mr="7px"
                          />

                          <InputRightElement>
                            <SearchIcon color="gray.400" />
                          </InputRightElement>
                        </InputGroup>

                        {filteredTasks.map((task, taskIndex) => (
                          <MenuItem
                            key={taskIndex}
                            fontSize="13px"
                            color="gray.500"
                            p="10px"
                            fontWeight="light"
                            borderBottom="0.8px solid rgb(219, 226, 237)"
                            onClick={() =>
                              handleInputChange(
                                "Sales Activity",
                                index,
                                "task",
                                task
                              )
                            }
                          >
                            {task}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      value={row.comment}
                      onChange={(e) =>
                        handleInputChange(
                          "Sales Activity",
                          index,
                          "comment",
                          e.target.value
                        )
                      }
                      w="140px"
                      p="7px"
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      mr="4px"
                      mt="9px"
                      mb="9px"
                      type="number"
                      textAlign="center"
                      value={row.hours.mon}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "mon",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      mr="4px"
                      type="number"
                      textAlign="center"
                      value={row.hours.tue}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "tue",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      mr="4px"
                      type="number"
                      textAlign="center"
                      value={row.hours.wed}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "wed",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      mr="4px"
                      p="7px"
                      type="number"
                      textAlign="center"
                      value={row.hours.thu}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "thu",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      mr="4px"
                      type="number"
                      textAlign="center"
                      value={row.hours.fri}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "fri",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      mr="4px"
                      type="number"
                      textAlign="center"
                      value={row.hours.sat}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "sat",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      mr="4px"
                      type="number"
                      textAlign="center"
                      value={row.hours.sun}
                      onChange={(e) =>
                        handleHourChange(
                          "Sales Activity",
                          index,
                          "sun",
                          e.target.value
                        )
                      }
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#f7f9fb"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      variant="filled"
                      size="sm"
                      w="70px"
                      p="7px"
                      textAlign="center"
                      value={row.total}
                      fontSize="13px"
                      color="gray.500"
                      bgColor="#fcfdfd"
                      border="none"
                      borderColor="transparent"
                      fontWeight="light"
                      _focus={{
                        bgColor: "#f7f9fb",
                        borderColor: "black",
                        border: "1px",
                      }}
                    />
                  </td>
                  <td>
                    <IconButton
                      variant="unstyled"
                      fontSize="15px"
                      icon={<AddIcon color="gray.500 " />}
                      onClick={addSalesRow}
                    ></IconButton>
                  </td>
                  <td>
                    {index == 0 ? (
                      <></>
                    ) : (
                      <IconButton
                        variant="unstyled"
                        fontSize="15px"
                        icon={<MinusIcon color="gray.500 " />}
                        onClick={() => deleteSalesRow(index)}
                      ></IconButton>
                    )}
                  </td>
                </tr>
              ))}
              {/* -------- Sales Activity rows end -------- */}

              {/* ################################################################################################################################ */}

              {/* -------- Total hours row starts -------- */}
              <tr>
                <td className="text-[#6a6c74] font-bold p-2">Total Hours</td>
                <td colSpan="3"></td>{" "}
                <td
                  className={`text-center ${
                    total.mon > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.mon}
                </td>
                <td
                  className={`text-center ${
                    total.tue > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.tue}
                </td>
                <td
                  className={`text-center ${
                    total.wed > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.wed}
                </td>
                <td
                  className={`text-center ${
                    total.thu > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.thu}
                </td>
                <td
                  className={`text-center ${
                    total.fri > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.fri}
                </td>
                <td
                  className={`text-center ${
                    total.sat > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.sat}
                </td>
                <td
                  className={`text-center ${
                    total.sun > 8 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.sun}
                </td>
                <td
                  className={`text-center ${
                    total.overall > 56 ? "text-red-500" : ""
                  } font-light`}
                >
                  {total.overall}
                </td>
              </tr>
              {/* -------- Total hours row ends -------- */}

              {/* Machine hours row */}
              <tr>
                <td className="text-[#6a6c74] font-bold p-2">Machine Hours</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              {/* Break hours row */}
              <tr>
                <td className="text-[#6a6c74] font-bold p-2">Break Hours</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Box>

        {/* --------------- Timesheet Table ends ------------------- */}

        {/* Flex dsplay for Save and Submit buttons */}
        <Flex justifyContent="flex-end">
          <Button
            bgColor="#19105b"
            variant="solid"
            w="120px"
            color="white"
            fontSize="13px"
            fontFamily="Arial"
            borderRadius="4px"
            fontWeight="light"
            mr="20px"
            _hover={{ bgColor: "#19105b" }}
            _active={{ bgColor: "#19105b" }}
            onClick={saveData}
          >
            SAVE
          </Button>
          <Button
            bgColor="#ff6196"
            variant="solid"
            w="120px"
            color="white"
            fontSize="13px"
            fontFamily="Arial"
            borderRadius="4px"
            fontWeight="light"
            rightIcon={<ArrowForwardIcon />}
            _hover={{ bgColor: "#ff6196" }}
            _active={{ bgColor: "#ff6196" }}
          >
            SUBMIT
          </Button>
        </Flex>
      </Box>
    </TabPanel>
  );
};

export default TimesheetPanel;
