from django.test import TestCase

from core.models import Element, Room, User
from core.services.element_service import ElementService


class ElementServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Arrange: User
        cls.test_username = "test_username"
        cls.test_email = "test_email@example.com"
        cls.test_password = "test_password"
        cls.test_user = User.objects.create_user(
            cls.test_username, cls.test_email, cls.test_password
        )

        # Arrange: Room
        cls.test_room_identifier = "test_room"
        cls.test_room_title = "Test Room"
        cls.test_room = Room(
            identifier=cls.test_room_identifier,
            owner=cls.test_user,
            title=cls.test_room_title,
            questions_enabled=True,
        )
        cls.test_room.save()

    def test_reset_elements_to_default(self):
        # Act
        ElementService.reset_elements_to_default(self.test_room)

        # Assert
        icons = map(lambda elt: elt.icon, self.test_room.elements.all())
        self.assertIn("sentiment.positive", icons)
        self.assertIn("completion.yes", icons)

    def test_get_elements_for_room(self):
        # Arrange
        Element(room=self.test_room, icon="completion.yes", section=0, order=0).save()
        Element(room=self.test_room, icon="completion.no", section=0, order=1).save()

        # Act
        elements = ElementService.get_elements_for_room(self.test_room)

        # Assert
        self.assertEquals(len(elements), 2)

    def test_get_element_by_id_for_room(self):
        # Arrange
        element = Element(
            room=self.test_room, icon="completion.yes", section=0, order=0
        )
        element.save()

        # Act
        result = ElementService.get_element_by_id_for_room(element.id, self.test_room)

        # Assert
        self.assertIsNotNone(result)
        self.assertEqual(result.id, element.id)

    def test_get_element_by_id_for_room_fails_for_wrong_room(self):
        # Arrange: Other room
        test_room = Room(
            identifier="test_other_room",
            owner=self.test_user,
            title="Other Room",
            questions_enabled=True,
        )
        test_room.save()

        # Arrange: Element
        element = Element(
            room=self.test_room, icon="completion.yes", section=0, order=0
        )
        element.save()

        # Act
        result = ElementService.get_element_by_id_for_room(element.id, test_room)

        # Assert
        self.assertIsNone(result)

    def test_update_element_changes(self):
        # Arrange
        element = Element(
            room=self.test_room, icon="completion.yes", section=0, order=0
        )
        element.save()
        icon = "completion.no"

        # Act
        ElementService.update_element(element, {"icon": icon})

        # Assert
        self.assertEqual(element.icon, icon)
        self.assertEqual(element.section, 0)

    def test_create_element_from_dict(self):
        # Arrange
        icon = "completion.yes"
        name = "Example Element"
        order = 3
        properties = {"icon": icon, "name": name, "order": order}

        # Act
        element = ElementService.create_element_from_dict(self.test_room, properties)

        # Assert
        self.assertEqual(element.icon, icon)
        self.assertEqual(element.name, name)
        self.assertEqual(element.section, 0)
        self.assertEqual(element.order, order)

    def test_delete_element(self):
        # Arrange
        element = Element(
            room=self.test_room, icon="completion.yes", section=0, order=0
        )
        element.save()

        # Assert
        self.assertEqual(len(ElementService.get_elements_for_room(self.test_room)), 1)

        # Act
        ElementService.delete_element(element)

        # Assert
        self.assertEqual(len(ElementService.get_elements_for_room(self.test_room)), 0)
