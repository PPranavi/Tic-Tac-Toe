"""
unitTests with mocking:

This files tests the dB update functionality.
"""
import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import add_player, models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'admin'

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'Pranavi',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Pranavi'],
            },
            {
                KEY_INPUT: 'Pranavi',
                KEY_EXPECTED: "(duplicate error)",
            },
            {
                KEY_INPUT: 'guest',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Pranavi', 'guest'],
            }
        ]
        
        self.failure_test_params = [
            {
                KEY_INPUT: 'Guest',
                KEY_EXPECTED: ['Guest', INITIAL_USERNAME],
            },
            {
                KEY_INPUT: 'Guest',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Guest', "(duplicate error)"],
            },
            {
                KEY_INPUT: 'NewUser',
                KEY_EXPECTED: [INITIAL_USERNAME, 'NewUser', 'Guest'],
            }
        ]
        
        initial_person = models.Person(username=INITIAL_USERNAME, rank=100)
        self.initial_db_mock = [initial_person]
    
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
            
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
                        
                        actual_result = add_player(test[KEY_INPUT])
                        expected_result = test[KEY_EXPECTED]
                        
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result, expected_result)
                        self.assertEqual(actual_result[len(actual_result)-1], expected_result[len(expected_result)-1])
                        
    def test_failure(self):
        for test in self.failure_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
    
                        actual_result = add_player(test[KEY_INPUT])
                        expected_result = test[KEY_EXPECTED]
                        
                        self.assertNotEqual(actual_result, expected_result)
                        self.assertNotEqual(actual_result[len(actual_result)-1], expected_result[len(expected_result)-1])


if __name__ == '__main__':
    unittest.main()