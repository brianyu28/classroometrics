# Generated by Django 4.0.7 on 2022-08-16 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_element_link'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='element',
            name='identifier',
        ),
        migrations.AddField(
            model_name='room',
            name='questions_enabled',
            field=models.BooleanField(default=False),
        ),
    ]
