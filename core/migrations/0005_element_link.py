# Generated by Django 4.0.7 on 2022-08-12 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_element_is_visible'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='link',
            field=models.CharField(blank=True, max_length=2048),
        ),
    ]