# Generated by Django 4.1.1 on 2023-02-28 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_student_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='endstatus',
            field=models.CharField(blank=True, default=None, max_length=20, null=True),
        ),
    ]
