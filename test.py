from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Do before each test"""

        # not sure why we add this here
        self.client = app.test_client()
        app.config['TESTING'] = True

    

    def test_homepage(self):
        """Make sure session is saved and HTML is displayed"""

        # we put this in the set up instead:
        # with app.test_client() as client:

        with self.client:
            resp = self.client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('board', session)

            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('num_plays'))

            self.assertIn('Seconds left:', html)
            self.assertIn('<h4>Score:</h4>', html)


    def test_valid_word(self):
        """Test if word is valid with modified board in the session"""

        with self.client as client:
            # opens a session transaction - used to modify the session that the test client uses. Once the 'with block' is left, the session is restored
            with client.session_transaction() as temp_session:
                temp_session['board'] = [
                    ['Y', 'E', 'S', 'X', 'X'],
                    ['Y', 'E', 'S', 'X', 'X'],
                    ['Y', 'E', 'S', 'X', 'X'],
                    ['Y', 'E', 'S', 'X', 'X'],
                    ['Y', 'E', 'S', 'X', 'X']
                ]
        resp = self.client.get('/check-word?word=yes')
        self.assertEqual(resp.json['result'], 'ok')

    def test_not_word(self):
        """Test if word is not in the dictionary"""

        self.client.get('/')
        resp = self.client.get('/check-word?word=dkjfngbfrsu')
        self.assertEqual(resp.json['result'], 'not-word')

    
    def test_not_on_board(self):
        """Test if word is not on board"""

        self.client.get('/')
        resp = self.client.get('/check-word?word=nope')
        self.assertEqual(resp.json['result'], 'not-on-board')

