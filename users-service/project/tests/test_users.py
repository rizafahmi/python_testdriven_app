import json
import unittest

from project.tests.base import BaseTestCase
from project import db
from project.api.models import User

def add_user(username, email):
    user = User(username=username, email=email)
    db.session.add(user)
    db.session.commit()
    return user

class TestUserService(BaseTestCase):
    """Tests for the Users Service."""

    def test_users(self):
        """Ensure the /ping route behaves correctly."""
        response = self.client.get('/users/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('pong', data['message'])
        self.assertIn('OK', data['status'])

    def test_add_user(self):
        """Ensure a new user can be added to the database."""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'riza',
                    'email': 'riza@hacktiv8.com'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn('riza@hacktiv8.com was added!', data['message'])
            self.assertIn('OK', data['status'])

    def test_add_user_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty."""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('KO', data['status'])

    def test_add_user_invalid_json_keys(self):
        """Ensure error is thrown if the JSON object does not hav a username key."""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({'email': 'riza@hacktiv8.com'}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('KO', data['status'])

    def test_add_user_duplicate_user(self):
        """Ensure error is thrown if the email already exists."""
        with self.client:
            self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'riza',
                    'email': 'riza@hacktiv8.com'
                }),
                content_type='application/json'
            )
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'riza',
                    'email': 'riza@hacktiv8.com'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry. That email already exists.', data['message']
            )
            self.assertIn('KO', data['status'])

    def test_single_user(self):
        """Ensure get single user behaves correctly."""
        user = add_user(username='riza', email='riza@hacktiv8.com')
        with self.client:
            response = self.client.get(f'/users/{user.id}')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn('riza', data['data']['username'])
            self.assertIn('riza@hacktiv8.com', data['data']['email'])
            self.assertIn('OK', data['status'])

    def test_single_user_incorrect_id(self):
        """Ensure error is thrown if an id does not exist."""
        with self.client:
            response = self.client.get('/users/999')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('KO', data['status'])

    def test_all_user(self):
        """Ensure get all users behaves correctly."""
        add_user('riza', 'riza@hacktiv8.com')
        add_user('riza', 'rizafahmi@hacktiv8.com')
        with self.client:
            response = self.client.get('/users')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['users']), 2)
            self.assertIn('riza', data['data']['users'][0]['username'])
            self.assertIn('riza@hacktiv8.com', data['data']['users'][0]['email'])
            self.assertIn('riza', data['data']['users'][1]['username'])
            self.assertIn('rizafahmi@hacktiv8.com', data['data']['users'][1]['email'])
            self.assertIn('OK', data['status'])

    def test_main_no_users(self):
        """Ensure the main route behaves correctly when no users have been added to the database."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<h1>All Users</h1>', response.data)
        self.assertIn(b'<p>No users!</p>', response.data)

    def test_main_with_users(self):
        """Ensure the main route behaves correctly when users have been created to the database."""
        add_user('riza', 'riza@hacktiv8.com')
        add_user('rizafahmi', 'rizafahmi@gmail.com')
        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(b'riza', response.data)
            self.assertIn(b'rizafahmi', response.data)

    def test_main_add_user(self):
        """Ensure a new user can be added to the database."""
        with self.client:
            response = self.client.post(
                '/',
                data=dict(username='riza', email='riza@hacktiv8.com'),
                follow_redirects=True
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(b'riza', response.data)
if __name__ == '__main__':
    unittest.main()
