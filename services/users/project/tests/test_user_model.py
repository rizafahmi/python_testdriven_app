from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

from sqlalchemy.exc import IntegrityError


class TestUserModel(BaseTestCase):
    def test_add_user(self):
        user = User(
            username='justtest',
            email='test@test.com'
        )

        db.session.add(user)
        db.session.commit()
        self.assertTrue(user.id)
        self.assertEqual(user.username, 'justtest')
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.active)

    def test_duplicate_user(self):
        user = User(
            username='justtest',
            email='test@test.com'
        )

        db.session.add(user)
        db.session.commit()
        duplicate_user = User(
            username='justtest',
            email='newemail@test.com'
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_duplicate_email(self):
        user = User(
            username='justtest',
            email='test@test.com'
        )

        db.session.add(user)
        db.session.commit()

        duplicate_user = User(
            username='newusername',
            email='test@test.com'
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_to_json(self):
        user = add_user('justtest', 'test@test.com')
        self.assertTrue(isinstance(user.to_json(), dict))
