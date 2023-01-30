from rest_framework import serializers
from .models import *

class StudentLoginSerializer(serializers.ModelSerializer):
	class Meta:
		model = Student
		fields = ['sname','semail']

class StudentTestSerializer(serializers.ModelSerializer):
	class Meta:
		model = Student_Test
		fields = ['sname','tname']

class QuestionSerializer(serializers.ModelSerializer):
	class Meta:
		model=Question
		fields = '__all__'