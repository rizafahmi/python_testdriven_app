import unittest
from flask_script import Manager

from project import create_app, db
from project.api.models import User

app = create_app()
manager = Manager(app)

@manager.command
def recreate_db():
    """Recreate a database."""
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def test():
    """Runs the tests without code coverage."""
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

@manager.command
def seed_db():
    """Seed the database."""
    db.session.add(User(username='riza', email='riza@hacktiv8.com'))
    db.session.add(User(username='rizafahmi', email='rizafahmi@hacktiv8.com'))
    db.session.commit()

if __name__ == '__main__':
    manager.run()
