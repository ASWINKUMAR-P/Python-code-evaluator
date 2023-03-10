from django.contrib import admin
from django.urls import path,include
from user.views import *
from .views import *

urlpatterns=[
    path('login/', login),
    path('starttest/', starttest),
    path('sendstudent/', sendStudent),
    path('sendquestion/', sendQuestion),
    path('createTest/', createTest),
    path('timer/',setTimer),
    path('question/<str:pk1>/<str:pk2>', getQuestion),
    path('getquestion/<str:pk>/',getQuestions),
    path('deadline/<str:pk>/',getDeadline),
    path('execute/', execCode),
    path('submit/<str:pk1>/<str:pk2>', submit),
    path('result/<str:pk>/', result),
    path('createStudent/', createStudent),
    path('createQuestion/', createQuestion),
    path('gettest', getTest),
    path('validate/',validate),
    path('validateadmin/',validateadmin),
    path('generatereport/<str:pk>/',generateReport),
    path('exe/',verifyimage),
    path('take/',takeimage),
]