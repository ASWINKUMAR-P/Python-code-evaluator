# Generated by Django 4.1.1 on 2023-01-28 04:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_student_department_student_registernumber'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='type',
            new_name='level',
        ),
    ]
