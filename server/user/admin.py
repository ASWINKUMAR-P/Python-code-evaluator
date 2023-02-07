from django.contrib import admin
from .models import Student, Question, Test, Student_Test, Student_Question, Result

# Register your models here.

admin.site.register(Student)
admin.site.register(Question)
admin.site.register(Test)
admin.site.register(Student_Test)
admin.site.register(Student_Question)
admin.site.register(Result)
