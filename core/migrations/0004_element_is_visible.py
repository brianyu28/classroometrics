# Generated by Django 4.0.7 on 2022-08-12 02:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_room_element'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='is_visible',
            field=models.BooleanField(default=True),
        ),
    ]
