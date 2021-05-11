import { React, useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Spinner,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, Center,
} from "@chakra-ui/react";
import axios from 'axios';

export default function History({
  ...rest
}) {
  const [playHistory, setPlayHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const historyLoad = () => {
    axios.get('/game/profile', { withCredentials: true })
      .then((response) => {
        if (response.data.error) {
          setLoading(true);
          setPlayHistory([
          <Box align="center" minW="70vw" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
            USER NOT LOGGED IN
          </Box>
          ])
        } else {
          let games = [];
          if (response.data.length === 0) {
            games.push(
              <Box align="center" minW="70vw" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
                No games played
              </Box>
            )
          } else {
            let count = 0;
            games = response.data.map((game) => {
              count++;
              let dateCreated = "";
              let sortedRounds = game.rounds;
              sortedRounds.sort((a, b) => {
                return a.round_num - b.round_num;
              });

              return (
                <AccordionItem bg='white'>
                  <h2>
                    <AccordionButton>
                      <Box w="100%" textAlign="left">
                        <Text color="#474B4F" fontWeight="bold" fontSize="xl">Game {count}, Game Type: {game.game_type}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Round</Th>
                          <Th>Target Word</Th>
                          <Th>AI's Final Guess</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {
                          sortedRounds.map((round) => {
                            dateCreated = round.createdAt.slice(0,10);
                            return (
                              <Tr>
                                <Td>{round.round_num}</Td>
                                <Td>{round.given_word}</Td>
                                <Td>{round.guessed_word}</Td>
                              </Tr>
                            )
                          })
                        }
                      </Tbody>
                      <Tfoot>
                        <Tr>
                          <Th></Th>
                          <Th>Final Score</Th>
                          <Th>{game.score}</Th>
                        </Tr>
                        <Tr>
                          <Th></Th>
                          <Th>Game Date</Th>
                          <Th>{dateCreated}</Th>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </AccordionPanel>
                </AccordionItem>
              )
            })
          }
          
          setPlayHistory(games);
          setLoading(true);
          console.log(response.data);
        }
      }).catch((e) => {
        console.log(e);
      });
      
  }

  useEffect(() => {
    historyLoad();
  }, []);


  return (
    <>
      {loading ? (
        <Flex
          align="flex-start"
          justify={{ base: "center", md: "start", xl: "flex-start" }}
          direction={{ base: "column-reverse", md: "row" }}
          wrap="no-wrap"
          minH="70vh"
          bg="white"
          borderRadius="3xl"
          px={8}
          mb={16}
          {...rest}
        >
            <Center>
              <VStack>
                <Text color="#474B4F" fontWeight="bold" fontSize="5xl" pb={4} pt={4}>Games Played</Text>
                <Accordion minW="40vw" allowMultiple>
                  {playHistory}
                </Accordion>
              </VStack>
            </Center>
        </Flex>
      ) : (
        <Spinner size="lg" color="white"/>
      )}
    </>
  );
}