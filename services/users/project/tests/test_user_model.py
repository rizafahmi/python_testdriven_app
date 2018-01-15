from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

from sqlalchemy.exc import IntegrityError


class TestUserModel(BaseTestCase):
    def test_duplicate_user(self):
        user = User(
            username='justtest',
            email='test@test.com',
            password='test'
        )

        db.session.add(user)
        db.session.commit()
        duplicate_user = User(
            username='justtest',
            email='newemail@test.com',
            password='test'
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_duplicate_email(self):
        user = User(
            username='justtest',
            email='test@test.com',
            password='test'
        )

        db.session.add(user)
        db.session.commit()

        duplicate_user = User(
            username='newusername',
            email='test@test.com',
            password='test'
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_to_json(self):
        user = add_user('justtest', 'test@test.com', 'test')
        self.assertTrue(isinstance(user.to_json(), dict))

    def test_password_are_random(self):
        user_one = add_user('test1', 'test@test.com', 'test')
        user_two = add_user('test2', 'test2@test.com', 'test')
        self.assertNotEqual(user_one.password, user_two.password)

    def test_add_user(self):
        user = add_user('justtest', 'test@test.com', 'test')
        self.assertTrue(user.id)
        self.assertEqual(user.username, 'justtest')
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.active)
        self.assertTrue(user.password)
