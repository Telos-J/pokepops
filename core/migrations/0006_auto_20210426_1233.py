# Generated by Django 3.1.4 on 2021-04-26 12:33

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20210426_1232'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='slots',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(default=True), size=None),
        ),
    ]
