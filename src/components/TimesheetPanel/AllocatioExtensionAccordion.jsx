import {Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, Flex} from '@chakra-ui/react'

const AllocatioExtensionAccordion = () => {
    return (
      <Accordion allowToggle mb="10px">
        <AccordionItem>
          <AccordionButton
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              fontFamily: "Arial",
              fontWeight: 400,
              pl: 2,
              "&:hover": {
                backgroundColor: "#19105b",
              },
              "&:active": {
                backgroundColor: "#19105b",
              },
            }}
            bgColor="#19105b"
            color="white"
          >
            Allocation Extension
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            sx={{
              p: 0,
              m: 0,
            }}
          >
            <Box
              w="100%"
              sx={{
                fontWeight: 700,
                textAlign: "left",
                fontSize: "13px",
                fontFamily: "Arial",
              }}
            >
              <table className="table-auto w-full">
                <tr className="bg-[#ffe5ee] text-[#19105b]">
                  <td className="p-2">Project name</td>
                  <td>Project type</td>
                  <td>Project end date</td>
                  <td>Allocation end date</td>
                  <td>Allocation extension</td>
                </tr>
              </table>
            </Box>

            <Flex
              sx={{
                fontSize: "13px",
                fontFamily: "Arial",
                fontWeight: 400,
              }}
              textColor="#6a6c71"
              justifyContent="center"
              height="30px"
              alignContent="center"
              pt="5px"
            >
              No available options
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
}

export default AllocatioExtensionAccordion;