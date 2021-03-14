"""
unitTests without mocking:

This files tests the users array append functionality.
"""
import unittest
from in_game import add_players

USERNAME_INPUT = "user1"
PLAYERS_INPUT = "players"
EXPECTED_OUTPUT = "expected"

class InGameTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_parameters = [
            {
                USERNAME_INPUT: "Pranavi",
                PLAYERS_INPUT: [],
                EXPECTED_OUTPUT: ["Pranavi"]
            },
            {
                USERNAME_INPUT: "User1",
                PLAYERS_INPUT: ["Pranavi"],
                EXPECTED_OUTPUT: ["Pranavi", "User1"]
            },
            {
                USERNAME_INPUT: "Pranavi",
                PLAYERS_INPUT: ["Pranavi", "User1"],
                EXPECTED_OUTPUT: ["Pranavi", "User1"]
            }
        ]
        
        self.failure_test_params = [
            {
                USERNAME_INPUT: "Pranavi",
                PLAYERS_INPUT: [],
                EXPECTED_OUTPUT: ["Pranavi", "Pranavi", "Pranavi"]
            },
            {
                USERNAME_INPUT: "User1",
                PLAYERS_INPUT: ["Pranavi"],
                EXPECTED_OUTPUT: [ "User1", "Pranavi", "User1"]
            },
            {
                USERNAME_INPUT: "Pranavi",
                PLAYERS_INPUT: ["Pranavi", "User1"],
                EXPECTED_OUTPUT: ["Pranavi", "User1", "Pranavi"]
            }
        ]
        
    def test_add_user_success(self):
        for test in self.success_test_parameters:
            actual_result = add_players(test[USERNAME_INPUT], test[PLAYERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            
            self.assertEqual(actual_result,expected_result)
            self.assertEqual(actual_result[0],expected_result[0])
            self.assertEqual(len(actual_result),len(expected_result))
            
    def test_split_failure(self):
        for test in self.failure_test_params:
            actual_result = add_players(test[USERNAME_INPUT], test[PLAYERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            
            self.assertNotEqual(actual_result,expected_result)
            self.assertNotEqual(len(actual_result),len(expected_result))
            self.assertNotEqual(actual_result.count(test[USERNAME_INPUT]),expected_result.count(test[USERNAME_INPUT]))
            
if __name__ == '__main__':
    unittest.main()



